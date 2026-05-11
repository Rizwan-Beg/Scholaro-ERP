package com.scholaro.erp.controller;

import com.scholaro.erp.dto.AuthResponse;
import com.scholaro.erp.dto.LoginRequest;
import com.scholaro.erp.dto.RegisterRequest;
import com.scholaro.erp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for authentication endpoints.
 *
 * Provides three endpoints:
 * - POST /api/auth/register — Create a new account
 * - POST /api/auth/login    — Sign in and receive a JWT token
 * - GET  /api/auth/me       — Get the current authenticated user's profile
 *
 * All responses follow a consistent JSON structure with appropriate HTTP status codes.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Register a new user.
     *
     * @param request validated registration data (fullName, email, phone, password, confirmPassword, role)
     * @return 201 Created with JWT token and user info, or 400 Bad Request on validation failure
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Login with email and password.
     *
     * @param request validated login data (email, password)
     * @return 200 OK with JWT token and user info, or 401 Unauthorized on bad credentials
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Get the currently authenticated user's profile.
     * Requires a valid JWT token in the Authorization header.
     *
     * @param authentication injected by Spring Security from the JWT filter
     * @return 200 OK with user profile data
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            AuthResponse response = authService.getCurrentUser(userDetails.getUsername());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}

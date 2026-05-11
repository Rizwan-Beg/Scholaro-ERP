package com.scholaro.erp.service;

import com.scholaro.erp.dto.AuthResponse;
import com.scholaro.erp.dto.LoginRequest;
import com.scholaro.erp.dto.RegisterRequest;
import com.scholaro.erp.model.User;
import com.scholaro.erp.repository.UserRepository;
import com.scholaro.erp.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service layer for authentication operations.
 *
 * Handles the business logic for user registration and login,
 * including validation, password hashing, and JWT token generation.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Register a new user in the system.
     *
     * Steps:
     * 1. Check if passwords match
     * 2. Check if email is already registered
     * 3. Hash the password with BCrypt
     * 4. Save the user to MySQL
     * 5. Generate and return a JWT token
     *
     * @param request the registration request DTO
     * @return AuthResponse with JWT token and user info
     * @throws RuntimeException if validation fails
     */
    public AuthResponse register(RegisterRequest request) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("An account with this email already exists");
        }

        // Build and save the new user
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase().trim())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))  // BCrypt hash
                .role(User.Role.valueOf(request.getRole().toUpperCase()))
                .build();

        userRepository.save(user);

        // Generate JWT token for the newly registered user
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.success(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                "Registration successful — welcome to Scholaro!"
        );
    }

    /**
     * Authenticate a user with email and password.
     *
     * Steps:
     * 1. Authenticate using Spring Security's AuthenticationManager
     * 2. Look up the user in the database
     * 3. Generate and return a JWT token
     *
     * @param request the login request DTO
     * @return AuthResponse with JWT token and user info
     * @throws BadCredentialsException if credentials are invalid
     */
    public AuthResponse login(LoginRequest request) {
        // Authenticate using Spring Security (throws BadCredentialsException on failure)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        // Find the user in our database
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(authentication, user.getRole().name());

        return AuthResponse.success(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                "Login successful — welcome back!"
        );
    }

    /**
     * Get the current user's profile from their email.
     *
     * @param email the authenticated user's email (from JWT)
     * @return AuthResponse with user info (no token)
     */
    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .message("User profile retrieved successfully")
                .build();
    }
}

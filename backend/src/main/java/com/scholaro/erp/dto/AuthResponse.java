package com.scholaro.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for authentication responses.
 * Returned after successful login or registration,
 * containing the JWT token and basic user information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;       // JWT access token
    private String type;        // Token type (always "Bearer")
    private String email;
    private String fullName;
    private String role;
    private String message;     // Success message

    /**
     * Convenience factory for building a standard successful auth response.
     */
    public static AuthResponse success(String token, String email, String fullName, String role, String message) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .email(email)
                .fullName(fullName)
                .role(role)
                .message(message)
                .build();
    }
}

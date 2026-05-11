package com.scholaro.erp.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration requests.
 * Contains all fields required to create a new account,
 * with Bean Validation annotations for server-side validation.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    @Size(max = 255)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(min = 7, max = 20, message = "Phone number must be between 7 and 20 characters")
    @Pattern(regexp = "^[+\\d\\s\\-()]+$", message = "Phone number can only contain digits, spaces, +, -, (, )")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Please confirm your password")
    private String confirmPassword;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(STUDENT|TEACHER|ADMIN)$", message = "Role must be STUDENT, TEACHER, or ADMIN")
    private String role;
}

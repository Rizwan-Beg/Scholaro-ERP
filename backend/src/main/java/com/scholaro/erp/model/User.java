package com.scholaro.erp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * JPA Entity representing a user in the Scholaro ERP system.
 * Maps to the 'users' table in MySQL.
 *
 * Each user has a role (STUDENT, TEACHER, or ADMIN) and their
 * password is stored as a BCrypt hash for security.
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(nullable = false, length = 255)
    private String password;  // BCrypt hashed — never stored as plain text

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * Automatically set creation timestamp before persisting.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Enum representing the three user roles in the school ERP system.
     */
    public enum Role {
        STUDENT,
        TEACHER,
        ADMIN
    }
}

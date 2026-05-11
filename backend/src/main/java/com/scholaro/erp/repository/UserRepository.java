package com.scholaro.erp.repository;

import com.scholaro.erp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link User} entity.
 * Provides built-in CRUD operations plus custom query methods
 * for authentication lookups.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address (used during login).
     *
     * @param email the email to search for
     * @return an Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if an email is already registered (used during registration).
     *
     * @param email the email to check
     * @return true if a user with this email already exists
     */
    boolean existsByEmail(String email);
}

package com.scholaro.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Scholaro ERP Authentication Module.
 * This Spring Boot application provides user registration, login,
 * and JWT-based session management for the School ERP system.
 */
@SpringBootApplication
public class ScholaroErpApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScholaroErpApplication.class, args);
    }
}

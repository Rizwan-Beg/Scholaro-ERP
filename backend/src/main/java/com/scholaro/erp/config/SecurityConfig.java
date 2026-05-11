package com.scholaro.erp.config;

import com.scholaro.erp.security.CustomUserDetailsService;
import com.scholaro.erp.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration for the Scholaro ERP Authentication Module.
 *
 * Key decisions:
 * - Stateless sessions (JWT-based, no server-side session)
 * - CSRF disabled (safe for stateless JWT APIs)
 * - /api/auth/register and /api/auth/login are publicly accessible
 * - All other endpoints require a valid JWT token
 * - BCrypt password encoding with strength 10
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Define the main security filter chain.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF — we use stateless JWT tokens
                .csrf(csrf -> csrf.disable())

                // Enable CORS (configured in CorsConfig)
                .cors(cors -> {})

                // Configure URL authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints — no authentication required
                        .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )

                // Use stateless session management (no cookies/sessions)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Use our custom UserDetailsService for authentication
                .authenticationProvider(authenticationProvider())

                // Add JWT filter before the default username/password filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configure the authentication provider with our UserDetailsService and BCrypt encoder.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Expose the AuthenticationManager bean for use in the AuthService.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * BCrypt password encoder — industry standard for password hashing.
     * Strength of 10 (default) provides a good balance of security and performance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

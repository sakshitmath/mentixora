package com.mentixora.backend.repository;

import com.mentixora.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// This interface gives us all database operations for User automatically
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email - used for login
    Optional<User> findByEmail(String email);

    // Check if email exists - used for signup validation
    boolean existsByEmail(String email);

    // Check if username exists - used for signup validation
    boolean existsByUsername(String username);
}
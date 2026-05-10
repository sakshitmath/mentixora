package com.mentixora.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// This is what we send back after successful login or signup
@Data
@AllArgsConstructor
public class AuthResponse {

    // JWT token - frontend stores this and sends it with every request
    private String token;

    // Basic user info to show on frontend immediately
    private String username;
    private String email;
    private Long userId;
}
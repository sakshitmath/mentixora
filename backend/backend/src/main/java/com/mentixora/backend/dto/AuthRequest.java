package com.mentixora.backend.dto;

import lombok.Data;

// This is the data we receive when user tries to signup or login
@Data
public class AuthRequest {

    // For signup: username, email, password
    // For login: email, password
    private String username;
    private String email;
    private String password;
}
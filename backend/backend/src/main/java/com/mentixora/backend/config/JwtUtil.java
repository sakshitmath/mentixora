package com.mentixora.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

// This class handles everything related to JWT tokens
@Component
public class JwtUtil {

    // Gets the secret key from application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Gets expiration time from application.properties (24 hours)
    @Value("${jwt.expiration}")
    private Long expiration;

    // Creates a secret key from our secret string
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generates a JWT token for a user
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    // Extracts username from a JWT token
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // Checks if token is still valid
    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Extracts all data from token
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
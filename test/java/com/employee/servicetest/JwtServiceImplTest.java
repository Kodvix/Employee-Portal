package com.employee.servicetest;

import com.employee.entity.Role;
import com.employee.service.JwtServiceImpl;

import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceImplTest {

    private JwtServiceImpl jwtService;
    private String token;

    @BeforeEach
    void setUp() {
        jwtService = new JwtServiceImpl();
        token = jwtService.generateToken("user@example.com", Role.ADMIN);
    }

    @Test
    void generateToken() {
        String generatedToken = jwtService.generateToken("test@example.com", Role.ADMIN);
        assertNotNull(generatedToken);
        assertTrue(generatedToken.length() > 0);
    }

    @Test
    void extractEmail() {
        String email = jwtService.extractEmail(token);
        assertEquals("user@example.com", email);
    }

    @Test
    void extractRole() {
        String role = jwtService.extractRole(token);
        assertEquals(Role.ADMIN.name(), role);
    }

    @Test
    void validateToken() {
        assertTrue(jwtService.validateToken(token));
    }

    
}

package com.employee.dtotest;

import org.junit.jupiter.api.Test;

import com.employee.dto.LoginRequestDto;

import static org.junit.jupiter.api.Assertions.*;

class LoginRequestDtoTest {

    @Test
    void testGettersAndSetters() {
        LoginRequestDto dto = new LoginRequestDto();

        dto.setEmail("user@example.com");
        dto.setPassword("password123");

        assertEquals("user@example.com", dto.getEmail());
        assertEquals("password123", dto.getPassword());
    }

    @Test
    void testAllArgsConstructor() {
        LoginRequestDto dto = new LoginRequestDto("user@example.com", "password123");

        assertEquals("user@example.com", dto.getEmail());
        assertEquals("password123", dto.getPassword());
    }

    @Test
    void testNoArgsConstructorAndSetters() {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("user@example.com");
        dto.setPassword("password123");

        assertEquals("user@example.com", dto.getEmail());
        assertEquals("password123", dto.getPassword());
    }

    @Test
    void testToStringNotNull() {
        LoginRequestDto dto = new LoginRequestDto("user@example.com", "password123");
        String toStringResult = dto.toString();

        assertNotNull(toStringResult);
        assertFalse(toStringResult.isEmpty());
    }
}

package com.employee.dtotest;

import com.employee.dto.LoginResponseDto;
import com.employee.entity.Role;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginResponseDtoTest {

    @Test
    void testAllArgsConstructorAndGetters() {
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
        Role role = Role.ADMIN; // assuming Role enum has ADMIN, USER, etc.

        LoginResponseDto dto = new LoginResponseDto(token, role);

        assertEquals(token, dto.getToken());
        assertEquals(role, dto.getRole());
    }

    @Test
    void testSettersAndGetters() {
        LoginResponseDto dto = new LoginResponseDto(null, null);

        String token = "sample.token.string";
        Role role = Role.ADMIN;

        dto.setToken(token);
        dto.setRole(role);

        assertEquals(token, dto.getToken());
        assertEquals(role, dto.getRole());
    }

    @Test
    void testToStringNotNull() {
        LoginResponseDto dto = new LoginResponseDto("token", Role.ADMIN);
        String toStringResult = dto.toString();

        assertNotNull(toStringResult);
        assertFalse(toStringResult.isEmpty());
    }
}

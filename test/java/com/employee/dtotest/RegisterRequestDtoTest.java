package com.employee.dtotest;

import com.employee.dto.RegisterRequestDto;
import com.employee.entity.Role;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class RegisterRequestDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidRegisterRequestDto() {
        RegisterRequestDto dto = new RegisterRequestDto("user@example.com", "P@ssw0rd!", Role.EMPLOYEE);
        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
        assertEquals("user@example.com", dto.getEmail());
        assertEquals("P@ssw0rd!", dto.getPassword());
        assertEquals(Role.EMPLOYEE, dto.getRole());
    }

    @Test
    void testEmailIsBlank() {
        RegisterRequestDto dto = new RegisterRequestDto("", "P@ssw0rd!", Role.ADMIN);
        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    void testPasswordIsBlank() {
        RegisterRequestDto dto = new RegisterRequestDto("user@example.com", "", Role.ADMIN);
        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    void testRoleIsNull() {
        RegisterRequestDto dto = new RegisterRequestDto("user@example.com", "P@ssw0rd!", null);
        Set<ConstraintViolation<RegisterRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("role")));
    }
}

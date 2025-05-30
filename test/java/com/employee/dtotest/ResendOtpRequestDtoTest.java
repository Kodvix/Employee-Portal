package com.employee.dtotest;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.employee.dto.ResendOtpRequestDto;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ResendOtpRequestDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidEmail() {
        ResendOtpRequestDto dto = new ResendOtpRequestDto("user@example.com");
        Set<ConstraintViolation<ResendOtpRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
        assertEquals("user@example.com", dto.getEmail());
    }

    @Test
    void testEmailIsBlank() {
        ResendOtpRequestDto dto = new ResendOtpRequestDto("");
        Set<ConstraintViolation<ResendOtpRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("email") && v.getMessage().equals("Email is required")));
    }

    @Test
    void testEmailIsNull() {
        ResendOtpRequestDto dto = new ResendOtpRequestDto(null);
        Set<ConstraintViolation<ResendOtpRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("email") && v.getMessage().equals("Email is required")));
    }
}

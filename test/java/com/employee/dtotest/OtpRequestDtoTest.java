package com.employee.dtotest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.Test;

import com.employee.dto.OtpRequestDto;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;

class OtpRequestDtoTest {

    @Test
    void testAllArgsConstructorAndGetters() {
        OtpRequestDto dto = new OtpRequestDto("user@example.com", "123456");

        assertEquals("user@example.com", dto.getEmail());
        assertEquals("123456", dto.getOtp());
    }

    @Test
    void testNoArgsConstructorAndSetters() {
        OtpRequestDto dto = new OtpRequestDto();

        dto.setEmail("test@example.com");
        dto.setOtp("654321");

        assertEquals("test@example.com", dto.getEmail());
        assertEquals("654321", dto.getOtp());
    }

    @Test
    void testEmailAnnotationsPresent() throws NoSuchFieldException {
        Field emailField = OtpRequestDto.class.getDeclaredField("email");

        assertTrue(emailField.isAnnotationPresent(NotBlank.class), "Email field should have @NotBlank");
        assertTrue(emailField.isAnnotationPresent(Email.class), "Email field should have @Email");
    }

    @Test
    void testOtpAnnotationPresent() throws NoSuchFieldException {
        Field otpField = OtpRequestDto.class.getDeclaredField("otp");

        assertTrue(otpField.isAnnotationPresent(NotBlank.class), "Otp field should have @NotBlank");
    }
}

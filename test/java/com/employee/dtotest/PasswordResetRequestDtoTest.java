package com.employee.dtotest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.Test;

import com.employee.dto.PasswordResetRequestDto;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;

class PasswordResetRequestDtoTest {

    @Test
    void testAllArgsConstructorAndGetters() {
        PasswordResetRequestDto dto = new PasswordResetRequestDto(
                "user@example.com",
                "StrongP@ssw0rd",
                "StrongP@ssw0rd"
        );

        assertEquals("user@example.com", dto.getEmail());
        assertEquals("StrongP@ssw0rd", dto.getNewPassword());
        assertEquals("StrongP@ssw0rd", dto.getConfirmNewPassword());
    }

    @Test
    void testNoArgsConstructorAndSetters() {
        PasswordResetRequestDto dto = new PasswordResetRequestDto();

        dto.setEmail("test@example.com");
        dto.setNewPassword("NewPass123");
        dto.setConfirmNewPassword("NewPass123");

        assertEquals("test@example.com", dto.getEmail());
        assertEquals("NewPass123", dto.getNewPassword());
        assertEquals("NewPass123", dto.getConfirmNewPassword());
    }

    @Test
    void testEmailAnnotationsPresent() throws NoSuchFieldException {
        Field emailField = PasswordResetRequestDto.class.getDeclaredField("email");

        assertTrue(emailField.isAnnotationPresent(NotBlank.class), "Email field should have @NotBlank");
        assertTrue(emailField.isAnnotationPresent(Email.class), "Email field should have @Email");
    }

    @Test
    void testNewPasswordAnnotationsPresent() throws NoSuchFieldException {
        Field newPasswordField = PasswordResetRequestDto.class.getDeclaredField("newPassword");

        assertTrue(newPasswordField.isAnnotationPresent(NotBlank.class), "newPassword field should have @NotBlank");
    }

    @Test
    void testConfirmNewPasswordAnnotationsPresent() throws NoSuchFieldException {
        Field confirmNewPasswordField = PasswordResetRequestDto.class.getDeclaredField("confirmNewPassword");

        assertTrue(confirmNewPasswordField.isAnnotationPresent(NotBlank.class), "confirmNewPassword field should have @NotBlank");
    }
}

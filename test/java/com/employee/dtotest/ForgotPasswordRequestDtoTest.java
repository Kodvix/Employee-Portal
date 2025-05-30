package com.employee.dtotest;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.ConstraintViolation;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.employee.dto.ForgotPasswordRequestDto;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class ForgotPasswordRequestDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testGettersAndSetters() {
        ForgotPasswordRequestDto dto = new ForgotPasswordRequestDto();
        dto.setEmail("user@example.com");
        dto.setRepeatEmail("user@example.com");

        assertThat(dto.getEmail()).isEqualTo("user@example.com");
        assertThat(dto.getRepeatEmail()).isEqualTo("user@example.com");
    }

    @Test
    void whenEmailIsBlank_thenValidationFails() {
        ForgotPasswordRequestDto dto = new ForgotPasswordRequestDto();
        dto.setEmail("");
        dto.setRepeatEmail("user@example.com");

        Set<ConstraintViolation<ForgotPasswordRequestDto>> violations = validator.validate(dto);
        assertThat(violations).extracting("propertyPath").extracting(Object::toString).contains("email");
    }

    @Test
    void whenRepeatEmailIsBlank_thenValidationFails() {
        ForgotPasswordRequestDto dto = new ForgotPasswordRequestDto();
        dto.setEmail("user@example.com");
        dto.setRepeatEmail("");

        Set<ConstraintViolation<ForgotPasswordRequestDto>> violations = validator.validate(dto);
        assertThat(violations).extracting("propertyPath").extracting(Object::toString).contains("repeatEmail");
    }

    @Test
    void whenBothEmailsAreBlank_thenValidationFails() {
        ForgotPasswordRequestDto dto = new ForgotPasswordRequestDto();
        dto.setEmail("");
        dto.setRepeatEmail("");

        Set<ConstraintViolation<ForgotPasswordRequestDto>> violations = validator.validate(dto);
        assertThat(violations).hasSize(2);
    }
}

package com.employee.dtotest;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.ConstraintViolation;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.employee.dto.HRComplaintDto;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class HRComplaintDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setup() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

   

    @Test
    void whenDescriptionIsBlank_thenValidationFails() {
        HRComplaintDto dto = new HRComplaintDto();
        dto.setType("Harassment");
        dto.setDescription("");

        Set<ConstraintViolation<HRComplaintDto>> violations = validator.validate(dto);
        assertThat(violations).extracting("propertyPath").extracting(Object::toString).contains("description");
    }

    @Test
    void whenAllValid_thenNoValidationErrors() {
        HRComplaintDto dto = new HRComplaintDto();
        dto.setType("Harassment");
        dto.setDescription("Manager is showing inappropriate behavior.");

        Set<ConstraintViolation<HRComplaintDto>> violations = validator.validate(dto);
        assertThat(violations).isEmpty();
    }
}

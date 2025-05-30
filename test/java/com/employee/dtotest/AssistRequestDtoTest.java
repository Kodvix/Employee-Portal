package com.employee.dtotest;

import jakarta.validation.*;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.employee.dto.AssistRequestDto;

import java.time.LocalDate;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class AssistRequestDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidAssistRequestDto() {
        AssistRequestDto dto = new AssistRequestDto();
        dto.setId(1L);
        dto.setType("Technical Support");
        dto.setJustification("System is not working properly");
        dto.setNeededByDate(LocalDate.now().plusDays(10));

        Set<ConstraintViolation<AssistRequestDto>> violations = validator.validate(dto);
        assertThat(violations).isEmpty();
    }

    @Test
    void testTypeIsBlank() {
        AssistRequestDto dto = new AssistRequestDto();
        dto.setType("");
        dto.setJustification("Some justification");
        dto.setNeededByDate(LocalDate.now().plusDays(5));

        Set<ConstraintViolation<AssistRequestDto>> violations = validator.validate(dto);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("type") &&
                v.getMessage().contains("required"));
    }

    @Test
    void testJustificationIsBlank() {
        AssistRequestDto dto = new AssistRequestDto();
        dto.setType("HR");
        dto.setJustification(" ");
        dto.setNeededByDate(LocalDate.now().plusDays(5));

        Set<ConstraintViolation<AssistRequestDto>> violations = validator.validate(dto);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("justification") &&
                v.getMessage().contains("required"));
    }

    @Test
    void testNeededByDateIsNull() {
        AssistRequestDto dto = new AssistRequestDto();
        dto.setType("Admin");
        dto.setJustification("Need help");
        dto.setNeededByDate(null);

        Set<ConstraintViolation<AssistRequestDto>> violations = validator.validate(dto);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("neededByDate") &&
                v.getMessage().contains("required"));
    }

    @Test
    void testNeededByDateIsPast() {
        AssistRequestDto dto = new AssistRequestDto();
        dto.setType("Technical Support");
        dto.setJustification("Issue");
        dto.setNeededByDate(LocalDate.now().minusDays(1));

        Set<ConstraintViolation<AssistRequestDto>> violations = validator.validate(dto);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("neededByDate") &&
                v.getMessage().contains("future"));
    }
}

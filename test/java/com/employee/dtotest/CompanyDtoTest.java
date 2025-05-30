package com.employee.dtotest;

import jakarta.validation.*;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.employee.dto.CompanyDto;
import com.employee.dto.ProjectDto;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class CompanyDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidCompanyDto() {
        CompanyDto dto = new CompanyDto();
        dto.setId(1L);
        dto.setName("KodVix Technologies");
        dto.setAddress("1234 Business Park, Sector 45");
        dto.setPhoneNumber("+91-9876543210");
        dto.setEmail("contact@kodvix.com");
        dto.setWebsiteUrl("https://www.kodvix.com");
        dto.setProjects(List.of(new ProjectDto()));  // assuming ProjectDto has no constraints

        Set<ConstraintViolation<CompanyDto>> violations = validator.validate(dto);
        assertThat(violations).isEmpty();
    }

    @Test
    void testNameIsBlank() {
        CompanyDto dto = new CompanyDto();
        dto.setName(" ");  // blank
        dto.setAddress("1234 Business Park");
        dto.setPhoneNumber("+91-9876543210");
        dto.setEmail("contact@kodvix.com");
        dto.setWebsiteUrl("https://www.kodvix.com");

        Set<ConstraintViolation<CompanyDto>> violations = validator.validate(dto);
        assertThat(violations)
            .anyMatch(v -> v.getPropertyPath().toString().equals("name") &&
                    v.getMessage().contains("required"));
    }

    @Test
    void testEmailInvalid() {
        CompanyDto dto = new CompanyDto();
        dto.setName("KodVix");
        dto.setAddress("Address");
        dto.setPhoneNumber("+91-9876543210");
        dto.setEmail("invalid-email");
        dto.setWebsiteUrl("https://www.kodvix.com");

        Set<ConstraintViolation<CompanyDto>> violations = validator.validate(dto);
        assertThat(violations)
            .anyMatch(v -> v.getPropertyPath().toString().equals("email") &&
                    v.getMessage().contains("Invalid email format"));
    }

    @Test
    void testWebsiteUrlInvalid() {
        CompanyDto dto = new CompanyDto();
        dto.setName("KodVix");
        dto.setAddress("Address");
        dto.setPhoneNumber("+91-9876543210");
        dto.setEmail("contact@kodvix.com");
        dto.setWebsiteUrl("htp://invalid-url");

        Set<ConstraintViolation<CompanyDto>> violations = validator.validate(dto);
        assertThat(violations)
            .anyMatch(v -> v.getPropertyPath().toString().equals("websiteUrl") &&
                    v.getMessage().contains("Invalid website URL format"));
    }
}

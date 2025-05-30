package com.employee.dtotest;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.ConstraintViolation;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.employee.dto.ProjectDto;
import com.employee.dto.ProjectStatus;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ProjectDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testProjectDtoGettersAndSetters() {
        ProjectDto project = new ProjectDto();
        project.setId(1L);
        project.setName("Website Redesign");
        project.setDescription("Redesigning company website to improve UX");
        project.setStatus(ProjectStatus.IN_PROGRESS);
        project.setStartDate(LocalDate.of(2024, 1, 15));
        project.setEndDate(LocalDate.of(2024, 6, 30));
        project.setCompanyId(10L);
        project.setTasks(Collections.emptyList());

        assertEquals(1L, project.getId());
        assertEquals("Website Redesign", project.getName());
        assertEquals("Redesigning company website to improve UX", project.getDescription());
        assertEquals(ProjectStatus.IN_PROGRESS, project.getStatus());
        assertEquals(LocalDate.of(2024, 1, 15), project.getStartDate());
        assertEquals(LocalDate.of(2024, 6, 30), project.getEndDate());
        assertEquals(10L, project.getCompanyId());
        assertNotNull(project.getTasks());
    }

    @Test
    void whenNameIsBlank_thenValidationFails() {
        ProjectDto project = new ProjectDto();
        project.setName(" "); // blank name
        project.setCompanyId(1L);

        Set<ConstraintViolation<ProjectDto>> violations = validator.validate(project);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("name")));
    }

    @Test
    void whenCompanyIdIsNull_thenValidationFails() {
        ProjectDto project = new ProjectDto();
        project.setName("Valid Name");
        project.setCompanyId(null);

        Set<ConstraintViolation<ProjectDto>> violations = validator.validate(project);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("companyId")));
    }

    @Test
    void whenValidProjectDto_thenNoValidationErrors() {
        ProjectDto project = new ProjectDto();
        project.setName("Valid Name");
        project.setCompanyId(5L);

        Set<ConstraintViolation<ProjectDto>> violations = validator.validate(project);
        assertTrue(violations.isEmpty());
    }
}

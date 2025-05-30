package com.employee.dtotest;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.employee.dto.Priority;
import com.employee.dto.TaskDto;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class TaskDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidTaskDto() {
        TaskDto taskDto = new TaskDto();
        taskDto.setId(1L);
        taskDto.setTitle("Implement login feature");
        taskDto.setDescription("Implement login with JWT token");
        taskDto.setPriority(Priority.HIGH);
        taskDto.setDueDate(LocalDateTime.of(2025, 12, 31, 23, 59));
        taskDto.setAssignedTo("khushi.kala");
        taskDto.setCompletedAt(LocalDateTime.of(2025, 12, 15, 18, 0));
        taskDto.setProgress("50% done");
        taskDto.setProjectId(10L);
        taskDto.setEmpId(3L);

        Set<ConstraintViolation<TaskDto>> violations = validator.validate(taskDto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void testTitleIsBlank() {
        TaskDto taskDto = new TaskDto();
        taskDto.setTitle("");
        taskDto.setProjectId(10L);

        Set<ConstraintViolation<TaskDto>> violations = validator.validate(taskDto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("title") && v.getMessage().equals("Title is required")));
    }

    @Test
    void testTitleIsNull() {
        TaskDto taskDto = new TaskDto();
        taskDto.setTitle(null);
        taskDto.setProjectId(10L);

        Set<ConstraintViolation<TaskDto>> violations = validator.validate(taskDto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("title") && v.getMessage().equals("Title is required")));
    }

    @Test
    void testProjectIdIsNull() {
        TaskDto taskDto = new TaskDto();
        taskDto.setTitle("Some Task");
        taskDto.setProjectId(null);

        Set<ConstraintViolation<TaskDto>> violations = validator.validate(taskDto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("projectId") && v.getMessage().equals("Project ID is required")));
    }
}

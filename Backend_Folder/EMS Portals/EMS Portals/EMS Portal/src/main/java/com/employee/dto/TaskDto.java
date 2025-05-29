package com.employee.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(name = "Task", description = "DTO for Task details")
public class TaskDto {

    @Schema(description = "Unique identifier of the task", example = "1")
    private Long id;

    @NotBlank(message = "Title is required")
    @Schema(description = "Title of the task", example = "Implement login feature")
    private String title;

    @Schema(description = "Detailed description of the task", example = "Implement login with JWT token")
    private String description;

    @Schema(description = "Priority level of the task", example = "HIGH")
    private Priority priority;

    @Schema(description = "Due date and time for the task", example = "2025-12-31T23:59:59")
    private LocalDateTime dueDate;

    @Schema(description = "Person assigned to the task", example = "khushi.kala")
    private String assignedTo;

    @Schema(description = "Date and time when the task was completed", example = "2025-12-15T18:00:00")
    private LocalDateTime completedAt;

    @Schema(description = "Current progress status", example = "50% done")
    private String progress;

    @NotNull(message = "Project ID is required")
    @Schema(description = "Associated project ID", example = "10")
    private Long projectId;

    private Long empId;
}

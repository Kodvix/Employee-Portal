package com.employee.dto;

import java.time.LocalDate;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(name = "Project", description = "DTO for project details")
public class ProjectDto {

    @Schema(description = "Unique identifier of the project", example = "1")
    private Long id;

    @Schema(description = "Name of the project", example = "Website Redesign")
    @NotBlank(message = "Project name is required")
    private String name;

    @Schema(description = "Detailed description of the project", example = "Redesigning company website to improve UX")
    private String description;

    @Schema(description = "Current status of the project", example = "IN_PROGRESS")
    private ProjectStatus status;

    @Schema(description = "Project start date", example = "2024-01-15")
    private LocalDate startDate;

    @Schema(description = "Project end date", example = "2024-06-30")
    private LocalDate endDate;

    @Schema(description = "ID of the company associated with this project", example = "10")
    @NotNull(message = "Company ID is required")
    private Long companyId;

    @Schema(description = "List of tasks associated with the project")
    private List<TaskDto> tasks;
}

package com.kodvix.ems.dto;

import java.time.LocalDateTime;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "Employee", description = "DTO representing details of an employee")
public class EmployeeDto {

    @Schema(description = "Unique identifier of the employee", example = "1")
    private Long id;

    @Schema(description = "First name of the employee", example = "Khushi")
    private String firstName;

    @Schema(description = "Last name of the employee", example = "Kala")
    private String lastName;

    @Schema(description = "Email address of the employee", example = "khushi.kala@example.com")
    private String email;

    @Schema(description = "Phone number of the employee", example = "9876543210")
    private String phone;

    @Schema(description = "Department where the employee works", example = "Engineering")
    private String department;

    @Schema(description = "Job title or position of the employee", example = "Software Engineer")
    private String jobTitle;

    @Schema(description = "Monthly or annual salary of the employee", example = "75000.0")
    private Double salary;

    @Schema(description = "Date when the employee was hired", example = "2023-01-15T09:00:00")
    private LocalDateTime hireDate;

    @Schema(description = "Current employment status", example = "Active")
    private String status;

    @Schema(description = "Timestamp of when the record was created", example = "2023-01-01T10:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "Timestamp of the last update to the record", example = "2024-01-10T15:45:00")
    private LocalDateTime updatedAt;

    @Schema(description = "List of documents associated with the employee")
    private List<DocumentDto> documents;

    @Schema(description = "Address associated with the employee")
    private AddressDto address;
}
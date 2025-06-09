package com.kodvix.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Schema(name = "Attendance", description = "DTO representing daily attendance details of an employee")
public class AttendanceDto {

    @Schema(description = "Unique identifier for the attendance record", example = "1")
    private Long id;

    @Schema(description = "Employee ID to whom this attendance record belongs", example = "1")
    private Long employeeId;

    @Schema(description = "Date of attendance", example = "2025-05-19")
    private LocalDate date;

    @Schema(description = "Check-in time of the employee", example = "09:00:00")
    private LocalTime checkIn;

    @Schema(description = "Check-out time of the employee", example = "18:00:00")
    private LocalTime checkOut;

    @Schema(description = "Attendance status - true if present, false if absent", example = "true")
    private boolean status;

    @Schema(description = "Optional remark or reason for absence/late entry", example = "Late due to traffic")
    private String remark;
}
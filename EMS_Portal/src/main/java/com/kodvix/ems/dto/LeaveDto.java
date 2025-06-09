package com.kodvix.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;

@Data
@Schema(name = "Leave Request",description = "DTO representing a leave request")
public class LeaveDto {

    @Schema(description = "Unique identifier of the leave record", example = "101")
    private Long id;

    @Schema(description = "Employee ID to whom the leave belongs", example = "1")
    private Long employeeId;

    @Schema(description = "Type of leave", example = "Sick Leave")
    private String leaveType;

    @Schema(description = "Start date of the leave", example = "2024-06-01")
    private LocalDate startDate;

    @Schema(description = "End date of the leave", example = "2024-06-05")
    private LocalDate endDate;

    @Schema(description = "Reason for taking leave", example = "Medical appointment")
    private String reason;

    @Schema(description = "Current status of the leave request", example = "PENDING")
    private String status;

    @Schema(description = "Leave document attached by the employee")
    private byte[] leaveDoc;
}

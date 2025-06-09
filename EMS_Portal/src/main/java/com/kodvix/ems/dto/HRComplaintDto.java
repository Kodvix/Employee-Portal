package com.kodvix.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(name = "HRComplaint", description = "DTO representing an HR complaint")
public class HRComplaintDto {

	@Schema(description = "ID of the complaint", example = "1")
	private Long id;

	@NotNull(message = "Type cannot be empty")
	@Schema(description = "Type of the HR complaint", example = "Harassment")
	private String type;

	@NotBlank(message = "Description cannot be empty")
	@Schema(description = "Detailed description of the HR complaint", example = "Manager is showing inappropriate behavior.")
	private String description;

	@Schema(description = "Supporting document for the HR complaint, if any")
	private byte[] hrdoc;

	@Schema(description = "Employee ID who submitted the complaint", example = "101")
	private Long employeeId;

	@Schema(description = "Submitted date and time of the complaint", example = "2025-05-20T15:30:00")
	private LocalDateTime submittedDate;

	@Schema(description = "Status of the complaint like Pending, Resolved, Rejected", example = "Pending")
	private String status;

	@Schema(description = "Employee's first name", example = "Khushi")
	private String firstName;

	@Schema(description = "Employee's last name", example = "Kala")
	private String lastName;

	@Schema(description = "Department", example = "IT")
	private String department;
}
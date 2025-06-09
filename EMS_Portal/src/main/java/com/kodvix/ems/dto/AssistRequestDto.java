package com.kodvix.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
@Schema(name = "AssistRequest", description = "DTO representing Assist request details submitted by employees")
public class AssistRequestDto {

    @Schema(description = "Unique identifier of the assist request", example = "1")
    private Long id;

    @Schema(description = "Type of assistance requested (e.g., Technical Support, HR, Admin)", example = "Technical Support", required = true)
    @NotBlank(message = "Type is required")
    private String type;

    @Schema(description = "Detailed justification for the assist request", example = "System is not working properly", required = true)
    @NotBlank(message = "Justification is required")
    private String justification;

    @Schema(description = "Date by which assistance is needed (should be in the future)", example = "2025-12-01", required = true)
    @NotNull(message = "Needed by date is required")
    @Future(message = "Needed by date must be in the future")
    private LocalDate neededByDate;
}
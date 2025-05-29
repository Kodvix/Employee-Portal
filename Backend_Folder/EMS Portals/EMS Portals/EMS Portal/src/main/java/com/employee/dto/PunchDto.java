package com.employee.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalTime;

@Data
@Schema(name = "Punch", description = "DTO for employee punch (check-in/check-out) times")
public class PunchDto {

    @Schema(description = "ID of the employee", example = "1")
    private Long employeeId;

    @Schema(description = "Punch time (check-in or check-out time)", example = "09:30:00")
    private LocalTime time;
}

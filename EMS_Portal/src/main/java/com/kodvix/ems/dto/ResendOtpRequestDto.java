package com.kodvix.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "ResendOtpRequest", description = "DTO to request resending of OTP to user's email")
public class ResendOtpRequestDto {

    @NotBlank(message = "Email is required")
    @Schema(description = "User's email address", example = "user@example.com")
    private String email;
}

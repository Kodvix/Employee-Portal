package com.kodvix.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "ForgotPasswordRequest", description = "DTO representing Request payload for initiating a forgot password process")
public class ForgotPasswordRequestDto {

    @NotBlank(message = "Email is required")
    @Schema(description = "Registered email address of the user", example = "user@example.com")
    private String email;

    @NotBlank(message = "Repeat Email is required")
    @Schema(description = "Repeated email for confirmation", example = "user@example.com")
    private String repeatEmail;
}
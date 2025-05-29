package com.employee.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "OtpRequest", description = "DTO representing Request object for submitting OTP verification details")
public class OtpRequestDto {

    @Schema(description = "User's email address", example = "user@example.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Schema(description = "OTP sent to the user's email", example = "123456")
    @NotBlank(message = "OTP is required")
    private String otp;
}

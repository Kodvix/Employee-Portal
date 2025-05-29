package com.employee.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "PasswordResetRequest", description = "DTO representing Request object for resetting user password")
public class PasswordResetRequestDto {

    @Schema(description = "User's email address", example = "user@example.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Schema(description = "New password", example = "StrongP@ssw0rd")
    @NotBlank(message = "New password is required")
    private String newPassword;

    @Schema(description = "Confirm new password", example = "StrongP@ssw0rd")
    @NotBlank(message = "Confirm new password is required")
    private String confirmNewPassword;
}

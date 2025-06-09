package com.kodvix.ems.dto;

import com.kodvix.ems.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(name = "RegisterRequest", description = "DTO for user registration requests")
public class RegisterRequestDto {

    @NotBlank(message = "Email is required")
    @Schema(description = "User's email address", example = "user@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Schema(description = "User's password", example = "P@ssw0rd!")
    private String password;

    @NotNull(message = "Role is required")
    @Schema(description = "User role: ADMIN or EMPLOYEE", example = "EMPLOYEE")
    private Role role;
}

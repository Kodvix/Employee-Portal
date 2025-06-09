package com.kodvix.ems.dto;

import com.kodvix.ems.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(name = "LoginResponse", description = "DTO representing Response object returned after successful login containing JWT token and user role")
public class LoginResponseDto {

    @Schema(description = "JWT authentication token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "Role of the authenticated user")
    private Role role;
}
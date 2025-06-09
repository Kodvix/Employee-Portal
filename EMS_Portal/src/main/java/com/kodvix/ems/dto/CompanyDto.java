package com.kodvix.ems.dto;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Schema(name = "Company", description = "DTO representing company information along with associated projects")
public class CompanyDto {

    @Schema(description = "Unique identifier of the company", example = "1")
    private Long id;

    @NotBlank(message = "Name is required")
    @Schema(description = "Name of the company", example = "KodVix Technologies")
    private String name;

    @NotBlank(message = "Address is required")
    @Schema(description = "Company's physical address", example = "1234 Business Park, Sector 45")
    private String address;

    @NotBlank(message = "Phone number is required")
    @Schema(description = "Contact phone number of the company", example = "+91-9876543210")
    private String phoneNumber;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(description = "Official email address of the company", example = "contact@kodvix.com")
    private String email;

    @NotBlank(message = "Website URL is required")
    @Pattern(
            regexp = "^(https?://)?(www\\.)?[a-zA-Z0-9\\-]+(\\.[a-zA-Z]{2,})+(/.*)?$",
            message = "Invalid website URL format"
    )
    @Schema(description = "Website URL of the company", example = "https://www.kodvix.com")
    private String websiteUrl;

    @Schema(description = "List of projects handled by the company")
    private List<ProjectDto> projects;
}

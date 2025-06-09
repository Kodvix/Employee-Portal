package com.kodvix.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "CompanyDocuments", description = "DTO for holding company-related documents of an employee")
public class CompanyDocumentsDto {

    @Schema(description = "Unique identifier for the document record", example = "1001")
    private Long id;

    @NotNull(message = "empId is required")
    @Schema(description = "Employee ID to whom the documents belong", example = "501")
    private Long empId;

    @Schema(description = "Offer Letter document (PDF, DOC, etc.)", format = "binary")
    private byte[] offerLetterDoc;

    @Schema(description = "Latest Pay Slip document", format = "binary")
    private byte[] latestPaySlipDoc;

    @Schema(description = "Other relevant company document", format = "binary")
    private byte[] doc;
}

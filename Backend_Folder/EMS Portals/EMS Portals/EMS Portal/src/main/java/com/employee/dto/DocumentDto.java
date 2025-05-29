package com.employee.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "Document", description = "DTO representing an uploaded document associated with an employee")
public class DocumentDto {

    @Schema(description = "Unique identifier of the document", example = "1")
    private Long id;

    @Schema(description = "Name of the document", example = "Resume")
    private String name;

    @Schema(description = "Type or format of the document", example = "application/pdf")
    private String type;

    @Schema(description = "Binary data of the document")
    private byte[] data;

    @Schema(description = "Date and time when the document was uploaded", example = "2025-05-20T14:30:00")
    private LocalDateTime uploadDate;

    @Schema(description = "ID of the employee associated with this document", example = "1")
    private Long employeeId;
}

package com.kodvix.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "Address", description = "DTO representing Address details of an employee")
public class AddressDto {

    @Schema(description = "Unique identifier of the address", example = "1")
    private Long id;

    @Schema(description = "Street address", example = "123 Main St")
    private String street;

    @Schema(description = "City name", example = "Indore")
    private String city;

    @Schema(description = "State", example = "MP")
    private String state;

    @Schema(description = "Postal or ZIP code", example = "10001")
    private String postalCode;

    @Schema(description = "Country name", example = "India")
    private String country;

    @Schema(description = "ID of the employee associated with this address", example = "1")
    private Long employeeId;
}

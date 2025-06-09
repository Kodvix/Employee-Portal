package com.kodvix.ems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "Event", description = "DTO representing details of a company related event")
public class EventDto {

    @Schema(description = "Unique identifier of the event", example = "1")
    private Long id;

    @Schema(description = "Name of the event", example = "Annual Meetup")
    private String name;

    @Schema(description = "Description of the event", example = "A gathering to discuss annual performance and plans")
    private String description;

    @Schema(description = "Date of the event in string format (e.g., yyyy-MM-dd)", example = "2025-06-10")
    private String date;

    @Schema(description = "Location where the event will be held", example = "Conference Hall, Office HQ")
    private String location;

    @Schema(description = "Image or banner associated with the event")
    private byte[] eventImage;
}

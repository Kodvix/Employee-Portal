package com.kodvix.ems.controller;

import java.io.IOException;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.kodvix.ems.dto.EventDto;
import com.kodvix.ems.service.EventService;

@RestController
@RequestMapping("/api/events")
@Tag(name = "Event API")
public class EventController {

    @Autowired
    private EventService eventService;

    @Operation(summary = "Get all events")
    @GetMapping
    public List<EventDto> getAllEvents() {
        return eventService.getAllEvents();
    }

    @Operation(summary = "Get an event by its ID")
    @GetMapping("/{id}")
    public EventDto getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @Operation(summary = "Create a new event with image upload")
    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createEvent(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("date") String date,
            @RequestParam("location") String location,
            @RequestParam("eventImage") MultipartFile eventImage) {

        try {
            EventDto eventDto = new EventDto();
            eventDto.setName(name);
            eventDto.setDescription(description);
            eventDto.setDate(date);
            eventDto.setLocation(location);
            eventDto.setEventImage(eventImage.getBytes());
            return ResponseEntity.ok(eventService.createEvent(eventDto));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process the image.");
        }
    }

    @Operation(summary = "Update an existing event, optionally with a new image")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateEventWithImage(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("date") String date,
            @RequestParam("location") String location,
            @RequestParam(value = "eventImage", required = false) MultipartFile eventImage) {

        try {
            EventDto eventDto = new EventDto();
            eventDto.setName(name);
            eventDto.setDescription(description);
            eventDto.setDate(date);
            eventDto.setLocation(location);

            if (eventImage != null && !eventImage.isEmpty()) {
                eventDto.setEventImage(eventImage.getBytes());
            }

            return ResponseEntity.ok(eventService.updateEvent(id, eventDto));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process the image.");
        }
    }

    @Operation(summary = "Delete an event by its ID")
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }
}

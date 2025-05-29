package com.employee.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.employee.dto.AssistRequestDto;
import com.employee.service.AssistRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/assist-requests")
@Tag(name = "Assist Request API")
public class AssistRequestController {

    private final AssistRequestService assistRequestService;

    @Autowired
    public AssistRequestController(AssistRequestService assistRequestService) {
        this.assistRequestService = assistRequestService;
    }

    @Operation(summary = "Create a new assist request")
    @PostMapping
    public ResponseEntity<AssistRequestDto> createAssistRequest(@Valid @RequestBody AssistRequestDto dto) {
        AssistRequestDto createdRequest = assistRequestService.createAssistRequest(dto);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    @Operation(summary = "Retrieve all assist requests")
    @GetMapping
    public ResponseEntity<List<AssistRequestDto>> getAllAssistRequests() {
        List<AssistRequestDto> requests = assistRequestService.getAllAssistRequests();
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @Operation(summary = "Get a specific assist request by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<AssistRequestDto> getAssistRequestById(@PathVariable("id") Long id) {
        AssistRequestDto assistRequest = assistRequestService.getAssistRequestById(id);
        if (assistRequest != null) {
            return new ResponseEntity<>(assistRequest, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Update an existing assist request")
    @PutMapping("/{id}")
    public ResponseEntity<AssistRequestDto> updateAssistRequest(
            @PathVariable("id") Long id,
            @Valid @RequestBody AssistRequestDto dto) {
        AssistRequestDto updatedRequest = assistRequestService.updateAssistRequest(id, dto);
        if (updatedRequest != null) {
            return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Delete an assist request by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssistRequest(@PathVariable("id") Long id) {
        boolean deleted = assistRequestService.deleteAssistRequest(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}

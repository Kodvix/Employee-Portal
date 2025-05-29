package com.employee.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.employee.dto.HRComplaintDto;
import com.employee.service.HRComplaintService;

@RestController
@RequestMapping("/api/complaints")
@Tag(name = "HR Complaint API")
public class HRComplaintController {

    @Autowired
    private HRComplaintService hrComplaintService;

    @Operation(summary = "Create a new HR complaint with optional file attachment")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HRComplaintDto> createComplaint(
            @RequestParam("type") String type,
            @RequestParam("description") String description,
            @RequestParam("employeeId") Long employeeId,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        HRComplaintDto dto = new HRComplaintDto();
        dto.setType(type);
        dto.setDescription(description);
        dto.setEmployeeId(employeeId);
        dto.setSubmittedDate(LocalDateTime.now());
        dto.setStatus("Pending");

        try {
            if (file != null && !file.isEmpty()) {
                dto.setHrdoc(file.getBytes());
            }
        } catch (IOException e) {
            throw new RuntimeException("Error reading uploaded file");
        }

        HRComplaintDto saved = hrComplaintService.saveComplaint(dto);
        return ResponseEntity.ok(saved);
    }

    @Operation(summary = "Update an existing HR complaint with optional file attachment and status")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HRComplaintDto> updateComplaint(
            @PathVariable Long id,
            @RequestParam("type") String type,
            @RequestParam("description") String description,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        HRComplaintDto dto = new HRComplaintDto();
        dto.setType(type);
        dto.setDescription(description);

        if (status != null) {
            dto.setStatus(status);
        }

        try {
            if (file != null && !file.isEmpty()) {
                dto.setHrdoc(file.getBytes());
            }
        } catch (IOException e) {
            throw new RuntimeException("Error reading uploaded file");
        }

        HRComplaintDto updated = hrComplaintService.updateComplaint(id, dto);
        return ResponseEntity.ok(updated);
    }


    @Operation(summary = "Retrieve all HR complaints")
    @GetMapping
    public ResponseEntity<List<HRComplaintDto>> getAllComplaints() {
        return ResponseEntity.ok(hrComplaintService.getAllComplaints());
    }

    @Operation(summary = "Retrieve an HR complaint by ID")
    @GetMapping("/{id}")
    public ResponseEntity<HRComplaintDto> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(hrComplaintService.getComplaintById(id));
    }

    @Operation(summary = "Delete an HR complaint by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComplaint(@PathVariable Long id) {
        hrComplaintService.deleteComplaint(id);
        return ResponseEntity.ok("Complaint deleted successfully");
    }
}

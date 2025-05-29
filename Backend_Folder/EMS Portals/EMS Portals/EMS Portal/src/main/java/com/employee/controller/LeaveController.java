package com.employee.controller;

import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.employee.dto.LeaveDto;
import com.employee.service.LeaveService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/leaves")
@Tag(name = "Leave API")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private ObjectMapper objectMapper;

    @Operation(summary = "Apply for leave for an employee with optional document upload")
    @PostMapping(value = "/{employeeId}", consumes = "multipart/form-data")
    public ResponseEntity<LeaveDto> applyLeave(
            @PathVariable Long employeeId,
            @RequestPart("leaveDto") String leaveDtoJson,
            @RequestPart("leaveDoc") MultipartFile leaveDoc) {

        LeaveDto leaveDto;
        try {
            leaveDto = objectMapper.readValue(leaveDtoJson, LeaveDto.class);
            leaveDto.setLeaveDoc(leaveDoc.getBytes());
        } catch (Exception e) {
            throw new RuntimeException("Error processing input: " + e.getMessage(), e);
        }

        LeaveDto savedLeave = leaveService.applyLeave(employeeId, leaveDto);
        return ResponseEntity.ok(savedLeave);
    }

    @Operation(summary = "Get all leaves for a specific employee")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveDto>> getLeavesByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getLeavesByEmployee(employeeId));
    }

    @Operation(summary = "Get leave details by leave ID")
    @GetMapping("/{leaveId}")
    public ResponseEntity<LeaveDto> getLeaveById(@PathVariable Long leaveId) {
        return leaveService.getLeaveById(leaveId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get all leaves")
    @GetMapping("/")
    public ResponseEntity<List<LeaveDto>> getAllLeave() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }


    @Operation(summary = "Delete a leave by ID")
    @DeleteMapping("/{leaveId}")
    public ResponseEntity<Void> deleteLeave(@PathVariable Long leaveId) {
        leaveService.deleteLeave(leaveId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update a leave request by ID with optional document upload")
    @PutMapping(value = "/{leaveId}", consumes = "multipart/form-data")
    public ResponseEntity<LeaveDto> updateLeave(
            @PathVariable Long leaveId,
            @RequestPart("leaveDto") String leaveDtoJson,
            @RequestPart(value = "leaveDoc", required = false) MultipartFile leaveDoc) {

        LeaveDto leaveDto;
        try {
            leaveDto = objectMapper.readValue(leaveDtoJson, LeaveDto.class);
            leaveDto.setId(leaveId); // ensure ID is set
            if (leaveDoc != null && !leaveDoc.isEmpty()) {
                leaveDto.setLeaveDoc(leaveDoc.getBytes());
            }
        } catch (IOException e) {
            throw new RuntimeException("Error processing input: " + e.getMessage(), e);
        }

        LeaveDto updatedLeave = leaveService.updateLeave(leaveDto);
        return ResponseEntity.ok(updatedLeave);
    }

}

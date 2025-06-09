package com.kodvix.ems.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.kodvix.ems.dto.CompanyDocumentsDto;
import com.kodvix.ems.service.CompanyDocumentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employee-images")
@RequiredArgsConstructor
@Tag(name = "Company Documents API")
public class CompanyDocumentsController {

    private final CompanyDocumentService service;

    @Operation(summary = "Upload new company documents for an employee")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CompanyDocumentsDto> create(@Valid
                                                      @RequestParam("empId") Long empId,
                                                      @RequestParam(value = "offerLetterDoc", required=false) MultipartFile offerLetterDoc,
                                                      @RequestParam(value = "latestPaySlipDoc", required = false) MultipartFile latestPaySlipDoc,
                                                      @RequestParam(value = "doc", required = false) MultipartFile doc) {

        CompanyDocumentsDto saved = service.save(empId, offerLetterDoc, latestPaySlipDoc, doc);
        return ResponseEntity.ok(saved);
    }

    @Operation(summary = "Update existing company documents by ID")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CompanyDocumentsDto> update(
            @PathVariable Long id,
            @RequestParam("empId") Long empId,
            @RequestParam(value = "offerLetterDoc", required = false) MultipartFile offerLetterDoc,
            @RequestParam(value = "latestPaySlipDoc", required = false) MultipartFile latestPaySlipDoc,
            @RequestParam(value = "doc", required = false) MultipartFile doc) {

        CompanyDocumentsDto updated = service.update(id, empId, offerLetterDoc, latestPaySlipDoc, doc);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete company documents by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get company documents by document ID")
    @GetMapping("/{id}")
    public ResponseEntity<CompanyDocumentsDto> getById(@PathVariable Long id) {
        CompanyDocumentsDto companyDocumentsDto = service.getById(id);
        if (companyDocumentsDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(companyDocumentsDto);
    }

    @Operation(summary = "Get all company documents for a specific employee by employee ID")
    @GetMapping("/emp/{empId}")
    public ResponseEntity<List<CompanyDocumentsDto>> getByEmpId(@PathVariable Long empId) {
        return ResponseEntity.ok(service.getByEmpId(empId));
    }

    @Operation(summary = "Get all company documents")
    @GetMapping
    public ResponseEntity<List<CompanyDocumentsDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

}

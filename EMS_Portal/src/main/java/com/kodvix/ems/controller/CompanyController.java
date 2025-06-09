package com.kodvix.ems.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kodvix.ems.dto.CompanyDto;
import com.kodvix.ems.service.CompanyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Tag(name = "Company API")
public class CompanyController {

    private final CompanyService companyService;

    @Operation(summary = "Create a new company")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CompanyDto createCompany(@RequestBody @Valid CompanyDto companyDTO) {
        return companyService.createCompany(companyDTO);
    }

    @Operation(summary = "Retrieve all companies")
    @GetMapping
    public List<CompanyDto> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    @Operation(summary = "Get company details by ID")
    @GetMapping("/{id}")
    public CompanyDto getCompanyById(@PathVariable Long id) {
        return companyService.getById(id);
    }

    @Operation(summary = "Update an existing company by ID")
    @PutMapping("/{id}")
    public CompanyDto updateCompany(@PathVariable Long id, @RequestBody @Valid CompanyDto companyDTO) {
        return companyService.update(id, companyDTO);
    }

    @Operation(summary = "Delete a company by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCompany(@PathVariable Long id) {
        companyService.delete(id);
        return ResponseEntity.ok("Company deleted successfully");
    }

}

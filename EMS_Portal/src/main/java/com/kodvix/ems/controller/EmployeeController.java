package com.kodvix.ems.controller;

import com.kodvix.ems.dto.EmployeeDto;
import com.kodvix.ems.service.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@Tag(name = "Employee API")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @Operation(summary = "Create a new employee")
    @PostMapping("/save")
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeDto employeeDto) {
        try {
            EmployeeDto created = employeeService.createEmployee(employeeDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
        }
    }

    @Operation(summary = "Get list of all employees")
    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        List<EmployeeDto> employees = employeeService.getAllEmployeesDto();
        return ResponseEntity.ok(employees);
    }

    @Operation(summary = "Get an employee by their ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        try {
            EmployeeDto employee = employeeService.getEmployeeByIdDto(id);
            return ResponseEntity.ok(employee);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @Operation(summary = "Update an existing employee by ID")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDto dto) {
        try {
            EmployeeDto updated = employeeService.updateEmployee(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
        }
    }

    @Operation(summary = "Delete an employee by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            String msg = employeeService.deleteEmployeeById(id);
            return ResponseEntity.ok(msg);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
        }
    }

    @Operation(summary = "Get an employee by email")
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getEmployeeByEmail(@PathVariable String email) {
        try {
            EmployeeDto employee = employeeService.getEmployeeByEmailDto(email);
            return ResponseEntity.ok(employee);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @Operation(summary = "Get employees by department")
    @GetMapping("/department/{department}")
    public ResponseEntity<List<EmployeeDto>> getByDepartment(@PathVariable String department) {
        List<EmployeeDto> employees = employeeService.getEmployeesByDepartmentDto(department);
        return ResponseEntity.ok(employees);
    }
}

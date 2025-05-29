package com.employee.controller;

import com.employee.dto.EmployeeDto;
import com.employee.entity.EmployeeDao;
import com.employee.mapper.EmployeeMapper;
import com.employee.service.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employee")
@Tag(name = "Employee API")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EmployeeMapper employeeMapper;

    @Autowired
    public EmployeeController(EmployeeService employeeService, EmployeeMapper employeeMapper) {
        this.employeeService = employeeService;
        this.employeeMapper = employeeMapper;
    }

    @Operation(summary = "Create a new employee")
    @PostMapping("/save")
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeDto employeeDto) {
        if (employeeService.emailExists(employeeDto.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        EmployeeDao saved = employeeService.saveEmployee(employeeMapper.toEntity(employeeDto));
        return ResponseEntity.ok(employeeMapper.toDto(saved));
    }

    @Operation(summary = "Get list of all employees")
    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        List<EmployeeDto> employees = employeeService.getAllEmployees()
                .stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(employees);
    }

    @Operation(summary = "Get an employee by their ID")
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        Optional<EmployeeDao> employeeOpt = employeeService.getEmployeeById(id);
        return employeeOpt
                .map(employee -> ResponseEntity.ok(employeeMapper.toDto(employee)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update an existing employee by ID")
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDto dto) {
        Optional<EmployeeDao> existingOpt = employeeService.getEmployeeById(id);
        if (existingOpt.isPresent()) {
            EmployeeDao employee = existingOpt.get();
            employee.setFirstName(dto.getFirstName());
            employee.setLastName(dto.getLastName());
            employee.setEmail(dto.getEmail());
            employee.setPhone(dto.getPhone());
            employee.setDepartment(dto.getDepartment());
            employee.setJobTitle(dto.getJobTitle());
            employee.setSalary(dto.getSalary());
            employee.setHireDate(dto.getHireDate());
            employee.setStatus(dto.getStatus());
            employee.setUpdatedAt(dto.getUpdatedAt());

            EmployeeDao updated = employeeService.saveEmployee(employee);
            return ResponseEntity.ok(employeeMapper.toDto(updated));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete an employee by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        if (employeeService.getEmployeeById(id).isPresent()) {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok("Employee Deleted Successfully");
        } else {
            return ResponseEntity.status(404).body("Employee Id not found");
        }
    }

    @Operation(summary = "Get an employee by email")
    @GetMapping("/email/{email}")
    public ResponseEntity<EmployeeDto> getEmployeeByEmail(@PathVariable String email) {
        Optional<EmployeeDao> employeeOpt = employeeService.getEmployeeByEmail(email);
        return employeeOpt
                .map(employee -> ResponseEntity.ok(employeeMapper.toDto(employee)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get employees by department")
    @GetMapping("/department/{department}")
    public ResponseEntity<List<EmployeeDto>> getByDepartment(@PathVariable String department) {
        List<EmployeeDto> employees = employeeService.getEmployeesByDepartment(department)
                .stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(employees);
    }
}

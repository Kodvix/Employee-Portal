package com.kodvix.ems.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee")
@PreAuthorize("hasRole('EMPLOYEE')")
@Tag(name = "Employee Dashboard API")
public class EmployeeAuthController {

	@Operation(summary = "Get Employee Dashboard")
	@GetMapping("/dashboard/employee")
	public String EmployeeDashboard() {
		return "Welcome, Employee!";
	}
}

package com.employee.controllertest;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.employee.controller.EmployeeAuthController;

class EmployeeAuthControllerTest {

    private final EmployeeAuthController controller = new EmployeeAuthController();

    @Test
    void EmployeeDashboard() {
        String response = controller.EmployeeDashboard();
        assertThat(response).isEqualTo("Welcome, Employee!");
    }
}

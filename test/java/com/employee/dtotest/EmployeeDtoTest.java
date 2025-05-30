package com.employee.dtotest;

import org.junit.jupiter.api.Test;

import com.employee.dto.AddressDto;
import com.employee.dto.DocumentDto;
import com.employee.dto.EmployeeDto;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class EmployeeDtoTest {

    @Test
    void testEmployeeDtoGettersAndSetters() {
        EmployeeDto employee = new EmployeeDto();

        Long id = 1L;
        String firstName = "Khushi";
        String lastName = "Kala";
        String email = "khushi.kala@example.com";
        String phone = "9876543210";
        String department = "Engineering";
        String jobTitle = "Software Engineer";
        Double salary = 75000.0;
        LocalDateTime hireDate = LocalDateTime.of(2023, 1, 15, 9, 0, 0);
        String status = "Active";
        LocalDateTime createdAt = LocalDateTime.of(2023, 1, 1, 10, 0, 0);
        LocalDateTime updatedAt = LocalDateTime.of(2024, 1, 10, 15, 45, 0);

        DocumentDto doc1 = new DocumentDto();
        doc1.setId(101L);
        doc1.setName("Resume");

        DocumentDto doc2 = new DocumentDto();
        doc2.setId(102L);
        doc2.setName("ID Proof");

        AddressDto address = new AddressDto();
        address.setId(201L);
        address.setCity("Indore");

        employee.setId(id);
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setEmail(email);
        employee.setPhone(phone);
        employee.setDepartment(department);
        employee.setJobTitle(jobTitle);
        employee.setSalary(salary);
        employee.setHireDate(hireDate);
        employee.setStatus(status);
        employee.setCreatedAt(createdAt);
        employee.setUpdatedAt(updatedAt);
        employee.setDocuments(List.of(doc1, doc2));
        employee.setAddress(address);

        assertThat(employee.getId()).isEqualTo(id);
        assertThat(employee.getFirstName()).isEqualTo(firstName);
        assertThat(employee.getLastName()).isEqualTo(lastName);
        assertThat(employee.getEmail()).isEqualTo(email);
        assertThat(employee.getPhone()).isEqualTo(phone);
        assertThat(employee.getDepartment()).isEqualTo(department);
        assertThat(employee.getJobTitle()).isEqualTo(jobTitle);
        assertThat(employee.getSalary()).isEqualTo(salary);
        assertThat(employee.getHireDate()).isEqualTo(hireDate);
        assertThat(employee.getStatus()).isEqualTo(status);
        assertThat(employee.getCreatedAt()).isEqualTo(createdAt);
        assertThat(employee.getUpdatedAt()).isEqualTo(updatedAt);

        assertThat(employee.getDocuments()).isNotNull().hasSize(2);
        assertThat(employee.getDocuments().get(0).getName()).isEqualTo("Resume");
        assertThat(employee.getDocuments().get(1).getName()).isEqualTo("ID Proof");

        assertThat(employee.getAddress()).isNotNull();
        assertThat(employee.getAddress().getCity()).isEqualTo("Indore");
    }
}

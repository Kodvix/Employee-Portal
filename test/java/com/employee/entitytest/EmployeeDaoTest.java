package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.AddressDao;
import com.employee.entity.DocumentDao;
import com.employee.entity.EmployeeDao;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class EmployeeDaoTest {

    @Test
    void testNoArgsConstructor() {
        EmployeeDao employee = new EmployeeDao();
        assertNotNull(employee);
    }

    @Test
    void testAllArgsConstructor() {
        AddressDao address = AddressDao.builder().id(1L).city("Mumbai").build();
        DocumentDao doc = DocumentDao.builder().id(1L).fileName("doc.pdf").build();

        EmployeeDao employee = new EmployeeDao(
                1L,
                "John",
                "Doe",
                "john.doe@example.com",
                "1234567890",
                "IT",
                "Developer",
                50000.0,
                LocalDateTime.of(2022, 1, 1, 9, 0),
                "Active",
                LocalDateTime.now(),
                LocalDateTime.now(),
                Collections.singletonList(doc),
                address
        );

        assertAll(
                () -> assertEquals(1L, employee.getId()),
                () -> assertEquals("John", employee.getFirstName()),
                () -> assertEquals("Doe", employee.getLastName()),
                () -> assertEquals("john.doe@example.com", employee.getEmail()),
                () -> assertEquals("1234567890", employee.getPhone()),
                () -> assertEquals("IT", employee.getDepartment()),
                () -> assertEquals("Developer", employee.getJobTitle()),
                () -> assertEquals(50000.0, employee.getSalary()),
                () -> assertEquals("Active", employee.getStatus()),
                () -> assertEquals(address, employee.getAddress()),
                () -> assertEquals(1, employee.getDocuments().size())
        );
    }

    @Test
    void testSettersAndGetters() {
        EmployeeDao employee = new EmployeeDao();
        AddressDao address = new AddressDao();
        DocumentDao doc = new DocumentDao();

        employee.setId(2L);
        employee.setFirstName("Jane");
        employee.setLastName("Smith");
        employee.setEmail("jane.smith@example.com");
        employee.setPhone("9876543210");
        employee.setDepartment("HR");
        employee.setJobTitle("Manager");
        employee.setSalary(60000.0);
        employee.setHireDate(LocalDateTime.of(2023, 6, 1, 10, 0));
        employee.setStatus("On Leave");
        employee.setCreatedAt(LocalDateTime.now().minusDays(5));
        employee.setUpdatedAt(LocalDateTime.now());
        employee.setDocuments(Collections.singletonList(doc));
        employee.setAddress(address);

        assertAll(
                () -> assertEquals(2L, employee.getId()),
                () -> assertEquals("Jane", employee.getFirstName()),
                () -> assertEquals("Smith", employee.getLastName()),
                () -> assertEquals("jane.smith@example.com", employee.getEmail()),
                () -> assertEquals("9876543210", employee.getPhone()),
                () -> assertEquals("HR", employee.getDepartment()),
                () -> assertEquals("Manager", employee.getJobTitle()),
                () -> assertEquals(60000.0, employee.getSalary()),
                () -> assertEquals("On Leave", employee.getStatus()),
                () -> assertEquals(address, employee.getAddress()),
                () -> assertEquals(1, employee.getDocuments().size())
        );
    }
}

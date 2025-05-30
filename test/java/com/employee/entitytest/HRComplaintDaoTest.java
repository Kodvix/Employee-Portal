package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.EmployeeDao;
import com.employee.entity.HRComplaintDao;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class HRComplaintDaoTest {

    @Test
    void testNoArgsConstructor() {
        HRComplaintDao complaint = new HRComplaintDao();
        assertNotNull(complaint);
    }

    @Test
    void testAllArgsConstructorAndGetters() {
        byte[] doc = new byte[]{1, 2, 3};
        EmployeeDao employee = new EmployeeDao();
        LocalDateTime now = LocalDateTime.now();

        HRComplaintDao complaint = new HRComplaintDao(
                1L,
                "Harassment",
                "Description of complaint",
                doc,
                employee,
                now,
                "Pending"
        );

        assertAll("Check all fields",
                () -> assertEquals(1L, complaint.getId()),
                () -> assertEquals("Harassment", complaint.getType()),
                () -> assertEquals("Description of complaint", complaint.getDescription()),
                () -> assertArrayEquals(doc, complaint.getHrdoc()),
                () -> assertEquals(employee, complaint.getEmployee()),
                () -> assertEquals(now, complaint.getSubmittedDate()),
                () -> assertEquals("Pending", complaint.getStatus())
        );
    }

    @Test
    void testBuilder() {
        byte[] doc = new byte[]{4, 5, 6};
        EmployeeDao employee = new EmployeeDao();
        LocalDateTime now = LocalDateTime.now();

        HRComplaintDao complaint = HRComplaintDao.builder()
                .id(2L)
                .type("Discrimination")
                .description("Detailed description")
                .hrdoc(doc)
                .employee(employee)
                .submittedDate(now)
                .status("Reviewed")
                .build();

        assertAll("Builder fields",
                () -> assertEquals(2L, complaint.getId()),
                () -> assertEquals("Discrimination", complaint.getType()),
                () -> assertEquals("Detailed description", complaint.getDescription()),
                () -> assertArrayEquals(doc, complaint.getHrdoc()),
                () -> assertEquals(employee, complaint.getEmployee()),
                () -> assertEquals(now, complaint.getSubmittedDate()),
                () -> assertEquals("Reviewed", complaint.getStatus())
        );
    }

    @Test
    void testSetters() {
        HRComplaintDao complaint = new HRComplaintDao();

        byte[] doc = new byte[]{7, 8, 9};
        EmployeeDao employee = new EmployeeDao();
        LocalDateTime now = LocalDateTime.now();

        complaint.setId(3L);
        complaint.setType("Workplace Safety");
        complaint.setDescription("Safety issue description");
        complaint.setHrdoc(doc);
        complaint.setEmployee(employee);
        complaint.setSubmittedDate(now);
        complaint.setStatus("Resolved");

        assertAll("Setters",
                () -> assertEquals(3L, complaint.getId()),
                () -> assertEquals("Workplace Safety", complaint.getType()),
                () -> assertEquals("Safety issue description", complaint.getDescription()),
                () -> assertArrayEquals(doc, complaint.getHrdoc()),
                () -> assertEquals(employee, complaint.getEmployee()),
                () -> assertEquals(now, complaint.getSubmittedDate()),
                () -> assertEquals("Resolved", complaint.getStatus())
        );
    }
}

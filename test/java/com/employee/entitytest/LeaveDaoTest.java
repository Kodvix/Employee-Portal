package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.EmployeeDao;
import com.employee.entity.LeaveDao;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class LeaveDaoTest {

    @Test
    void testNoArgsConstructorAndSettersGetters() {
        LeaveDao leave = new LeaveDao();

        EmployeeDao employee = new EmployeeDao();
        employee.setId(1L);

        leave.setId(10L);
        leave.setEmployee(employee);
        leave.setLeaveType("Sick Leave");
        leave.setStartDate(LocalDate.of(2025, 6, 1));
        leave.setEndDate(LocalDate.of(2025, 6, 5));
        leave.setReason("Flu");
        leave.setStatus("Pending");
        leave.setLeaveDoc(new byte[]{1, 2, 3});

        assertEquals(10L, leave.getId());
        assertEquals(employee, leave.getEmployee());
        assertEquals("Sick Leave", leave.getLeaveType());
        assertEquals(LocalDate.of(2025, 6, 1), leave.getStartDate());
        assertEquals(LocalDate.of(2025, 6, 5), leave.getEndDate());
        assertEquals("Flu", leave.getReason());
        assertEquals("Pending", leave.getStatus());
        assertArrayEquals(new byte[]{1, 2, 3}, leave.getLeaveDoc());
    }

    @Test
    void testAllArgsConstructor() {
        EmployeeDao employee = new EmployeeDao();
        employee.setId(2L);

        byte[] doc = new byte[]{4, 5, 6};

        LeaveDao leave = new LeaveDao(
                20L,
                employee,
                "Vacation",
                LocalDate.of(2025, 7, 10),
                LocalDate.of(2025, 7, 20),
                "Family trip",
                "Approved",
                doc
        );

        assertEquals(20L, leave.getId());
        assertEquals(employee, leave.getEmployee());
        assertEquals("Vacation", leave.getLeaveType());
        assertEquals(LocalDate.of(2025, 7, 10), leave.getStartDate());
        assertEquals(LocalDate.of(2025, 7, 20), leave.getEndDate());
        assertEquals("Family trip", leave.getReason());
        assertEquals("Approved", leave.getStatus());
        assertArrayEquals(doc, leave.getLeaveDoc());
    }

    @Test
    void testBuilder() {
        EmployeeDao employee = new EmployeeDao();
        employee.setId(3L);

        byte[] doc = new byte[]{7, 8, 9};

        LeaveDao leave = LeaveDao.builder()
                .id(30L)
                .employee(employee)
                .leaveType("Personal Leave")
                .startDate(LocalDate.of(2025, 8, 1))
                .endDate(LocalDate.of(2025, 8, 3))
                .reason("Moving")
                .status("Rejected")
                .leaveDoc(doc)
                .build();

        assertEquals(30L, leave.getId());
        assertEquals(employee, leave.getEmployee());
        assertEquals("Personal Leave", leave.getLeaveType());
        assertEquals(LocalDate.of(2025, 8, 1), leave.getStartDate());
        assertEquals(LocalDate.of(2025, 8, 3), leave.getEndDate());
        assertEquals("Moving", leave.getReason());
        assertEquals("Rejected", leave.getStatus());
        assertArrayEquals(doc, leave.getLeaveDoc());
    }
}

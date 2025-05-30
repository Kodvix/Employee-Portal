package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.AttendanceDao;
import com.employee.entity.EmployeeDao;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

class AttendanceDaoTest {

    @Test
    void testNoArgsConstructor() {
        AttendanceDao attendance = new AttendanceDao();
        assertNotNull(attendance);
    }

    @Test
    void testAllArgsConstructor() {
        EmployeeDao employee = EmployeeDao.builder()
                .id(100L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .build();

        AttendanceDao attendance = new AttendanceDao(
                1L,
                LocalDate.of(2025, 5, 29),
                LocalTime.of(9, 0),
                LocalTime.of(18, 0),
                true,
                "On time",
                employee
        );

        assertAll(
                () -> assertEquals(1L, attendance.getId()),
                () -> assertEquals(LocalDate.of(2025, 5, 29), attendance.getDate()),
                () -> assertEquals(LocalTime.of(9, 0), attendance.getCheckIn()),
                () -> assertEquals(LocalTime.of(18, 0), attendance.getCheckOut()),
                () -> assertTrue(attendance.isStatus()),
                () -> assertEquals("On time", attendance.getRemark()),
                () -> assertNotNull(attendance.getEmployee()),
                () -> assertEquals(100L, attendance.getEmployee().getId())
        );
    }

    @Test
    void testBuilder() {
        AttendanceDao attendance = AttendanceDao.builder()
                .id(2L)
                .date(LocalDate.now())
                .checkIn(LocalTime.of(10, 0))
                .checkOut(LocalTime.of(19, 0))
                .status(false)
                .remark("Late")
                .employee(EmployeeDao.builder().id(101L).build())
                .build();

        assertAll(
                () -> assertEquals(2L, attendance.getId()),
                () -> assertEquals("Late", attendance.getRemark()),
                () -> assertFalse(attendance.isStatus()),
                () -> assertNotNull(attendance.getEmployee()),
                () -> assertEquals(101L, attendance.getEmployee().getId())
        );
    }
}

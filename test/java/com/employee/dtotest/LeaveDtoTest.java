package com.employee.dtotest;

import org.junit.jupiter.api.Test;

import com.employee.dto.LeaveDto;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class LeaveDtoTest {

    @Test
    void testGettersAndSetters() {
        LeaveDto dto = new LeaveDto();

        dto.setId(101L);
        dto.setEmployeeId(1L);
        dto.setLeaveType("Sick Leave");
        dto.setStartDate(LocalDate.of(2024, 6, 1));
        dto.setEndDate(LocalDate.of(2024, 6, 5));
        dto.setReason("Medical appointment");
        dto.setStatus("PENDING");
        dto.setLeaveDoc(new byte[]{1, 2, 3});

        assertEquals(101L, dto.getId());
        assertEquals(1L, dto.getEmployeeId());
        assertEquals("Sick Leave", dto.getLeaveType());
        assertEquals(LocalDate.of(2024, 6, 1), dto.getStartDate());
        assertEquals(LocalDate.of(2024, 6, 5), dto.getEndDate());
        assertEquals("Medical appointment", dto.getReason());
        assertEquals("PENDING", dto.getStatus());
        assertArrayEquals(new byte[]{1, 2, 3}, dto.getLeaveDoc());
    }

    @Test
    void testToStringNotNull() {
        LeaveDto dto = new LeaveDto();
        dto.setId(101L);
        dto.setEmployeeId(1L);
        dto.setLeaveType("Sick Leave");
        dto.setStartDate(LocalDate.of(2024, 6, 1));
        dto.setEndDate(LocalDate.of(2024, 6, 5));
        dto.setReason("Medical appointment");
        dto.setStatus("PENDING");
        dto.setLeaveDoc(new byte[]{1, 2, 3});

        String toStringResult = dto.toString();
        assertNotNull(toStringResult);
        assertFalse(toStringResult.isEmpty());
    }
}

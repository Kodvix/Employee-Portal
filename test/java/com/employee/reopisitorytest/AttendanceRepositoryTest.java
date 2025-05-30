package com.employee.reopisitorytest;

import com.employee.entity.AttendanceDao;
import com.employee.entity.EmployeeDao;
import com.employee.repository.AttendanceRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AttendanceRepositoryTest {

    @Mock
    private AttendanceRepository attendanceRepository; // Mocked repository

    private EmployeeDao mockEmployee;
    private AttendanceDao mockAttendance1;
    private AttendanceDao mockAttendance2;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        // Create a mock Employee entity
        mockEmployee = EmployeeDao.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .build();

        // Create mock Attendance entities
        mockAttendance1 = AttendanceDao.builder()
                .id(1L)
                .date(LocalDate.of(2025, 5, 12))
                .checkIn(LocalTime.of(9, 0))
                .checkOut(LocalTime.of(17, 0))
                .status(true)
                .remark("Present")
                .employee(mockEmployee)
                .build();

        mockAttendance2 = AttendanceDao.builder()
                .id(2L)
                .date(LocalDate.of(2025, 5, 13))
                .checkIn(LocalTime.of(9, 15))
                .checkOut(LocalTime.of(17, 15))
                .status(true)
                .remark("Present")
                .employee(mockEmployee)
                .build();
    }

    @Test
    public void testFindByEmployee() {
        // Mock behavior for findByEmployee
        when(attendanceRepository.findByEmployee(mockEmployee)).thenReturn(Arrays.asList(mockAttendance1, mockAttendance2));

        // Call the method
        List<AttendanceDao> attendances = attendanceRepository.findByEmployee(mockEmployee);

        // Assertions
        assertNotNull(attendances);
        assertEquals(2, attendances.size());
        assertEquals(LocalDate.of(2025, 5, 12), attendances.get(0).getDate());
        assertEquals(LocalDate.of(2025, 5, 13), attendances.get(1).getDate());

        // Verify interaction
        verify(attendanceRepository, times(1)).findByEmployee(mockEmployee);
    }

    @Test
    public void testFindByEmployeeAndDate() {
        // Mock behavior for findByEmployeeAndDate
        when(attendanceRepository.findByEmployeeAndDate(mockEmployee, LocalDate.of(2025, 5, 12))).thenReturn(Arrays.asList(mockAttendance1));

        // Call the method
        List<AttendanceDao> attendances = attendanceRepository.findByEmployeeAndDate(mockEmployee, LocalDate.of(2025, 5, 12));

        // Assertions
        assertNotNull(attendances);
        assertEquals(1, attendances.size());
        assertEquals(LocalDate.of(2025, 5, 12), attendances.get(0).getDate());
        assertEquals(LocalTime.of(9, 0), attendances.get(0).getCheckIn());

        // Verify interaction
        verify(attendanceRepository, times(1)).findByEmployeeAndDate(mockEmployee, LocalDate.of(2025, 5, 12));
    }

    @Test
    public void testSaveAttendance() {
        // Mock behavior for save
        when(attendanceRepository.save(mockAttendance1)).thenReturn(mockAttendance1);

        // Call the method
        AttendanceDao savedAttendance = attendanceRepository.save(mockAttendance1);

        // Assertions
        assertNotNull(savedAttendance);
        assertEquals(LocalDate.of(2025, 5, 12), savedAttendance.getDate());
        assertEquals(LocalTime.of(9, 0), savedAttendance.getCheckIn());
        assertEquals("Present", savedAttendance.getRemark());

        // Verify interaction
        verify(attendanceRepository, times(1)).save(mockAttendance1);
    }

    @Test
    public void testDeleteAttendance() {
        // Perform delete operation
        attendanceRepository.delete(mockAttendance1);

        // Verify interaction
        verify(attendanceRepository, times(1)).delete(mockAttendance1);
    }
}
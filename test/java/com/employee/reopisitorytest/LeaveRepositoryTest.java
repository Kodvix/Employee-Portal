package com.employee.reopisitorytest;

import com.employee.entity.EmployeeDao;
import com.employee.entity.LeaveDao;
import com.employee.repository.LeaveRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LeaveRepositoryTest {

    @Mock
    private LeaveRepository leaveRepository; // Mocked repository

    private LeaveDao mockLeave1;
    private LeaveDao mockLeave2;
    private EmployeeDao mockEmployee;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create mock Employee
        mockEmployee = new EmployeeDao();
        mockEmployee.setId(1L);
        mockEmployee.setFirstName("John");
        mockEmployee.setLastName("Doe");
        mockEmployee.setEmail("john.doe@example.com");

        // Create mock Leave entities
        mockLeave1 = LeaveDao.builder()
                .id(1L)
                .employee(mockEmployee)
                .leaveType("Sick Leave")
                .startDate(LocalDate.of(2025, 5, 1))
                .endDate(LocalDate.of(2025, 5, 3))
                .reason("Flu symptoms")
                .status("Pending")
                .leaveDoc(new byte[]{1, 2, 3})
                .build();

        mockLeave2 = LeaveDao.builder()
                .id(2L)
                .employee(mockEmployee)
                .leaveType("Vacation")
                .startDate(LocalDate.of(2025, 6, 10))
                .endDate(LocalDate.of(2025, 6, 15))
                .reason("Family trip")
                .status("Approved")
                .leaveDoc(new byte[]{4, 5, 6})
                .build();
    }

    @Test
    void testFindByEmployeeId() {
        // Mock the behavior of findByEmployeeId
        when(leaveRepository.findByEmployeeId(1L)).thenReturn(Arrays.asList(mockLeave1, mockLeave2));

        // Call the method
        List<LeaveDao> result = leaveRepository.findByEmployeeId(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Sick Leave", result.get(0).getLeaveType());
        assertEquals("Vacation", result.get(1).getLeaveType());

        // Verify interaction
        verify(leaveRepository, times(1)).findByEmployeeId(1L);
    }

    @Test
    void testFindById() {
        // Mock the behavior of findById
        when(leaveRepository.findById(1L)).thenReturn(Optional.of(mockLeave1));

        // Call the method
        Optional<LeaveDao> result = leaveRepository.findById(1L);

        // Assertions
        assertTrue(result.isPresent());
        assertEquals("Sick Leave", result.get().getLeaveType());
        assertEquals("Flu symptoms", result.get().getReason());

        // Verify interaction
        verify(leaveRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        // Mock the behavior of findById for a non-existent ID
        when(leaveRepository.findById(99L)).thenReturn(Optional.empty());

        // Call the method
        Optional<LeaveDao> result = leaveRepository.findById(99L);

        // Assertions
        assertTrue(result.isEmpty());

        // Verify interaction
        verify(leaveRepository, times(1)).findById(99L);
    }

    @Test
    void testSaveLeave() {
        // Mock the behavior of save
        when(leaveRepository.save(mockLeave1)).thenReturn(mockLeave1);

        // Call the method
        LeaveDao savedLeave = leaveRepository.save(mockLeave1);

        // Assertions
        assertNotNull(savedLeave);
        assertEquals("Sick Leave", savedLeave.getLeaveType());
        assertEquals("Pending", savedLeave.getStatus());

        // Verify interaction
        verify(leaveRepository, times(1)).save(mockLeave1);
    }

    @Test
    void testDeleteLeave() {
        // Perform delete operation
        leaveRepository.delete(mockLeave1);

        // Verify interaction
        verify(leaveRepository, times(1)).delete(mockLeave1);
    }
}
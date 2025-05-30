package com.employee.controllertest;

import com.employee.controller.LeaveController;
import com.employee.dto.LeaveDto;
import com.employee.service.LeaveService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LeaveControllerTest {

    @Mock
    private LeaveService leaveService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private LeaveController leaveController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void applyLeave() throws Exception {
        Long employeeId = 1L;
        LeaveDto leaveDto = new LeaveDto();

        String leaveDtoJson = "{\"id\":1}";
        MultipartFile leaveDoc = new MockMultipartFile("leaveDoc", "file.txt", "text/plain", "content".getBytes());

        when(objectMapper.readValue(leaveDtoJson, LeaveDto.class)).thenReturn(leaveDto);
        when(leaveService.applyLeave(employeeId, leaveDto)).thenReturn(leaveDto);

        ResponseEntity<LeaveDto> response = leaveController.applyLeave(employeeId, leaveDtoJson, leaveDoc);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(leaveDto, response.getBody());
        verify(objectMapper).readValue(leaveDtoJson, LeaveDto.class);
        verify(leaveService).applyLeave(employeeId, leaveDto);
    }

    @Test
    void getLeavesByEmployee() {
        Long employeeId = 1L;
        List<LeaveDto> leaves = List.of(new LeaveDto(), new LeaveDto());

        when(leaveService.getLeavesByEmployee(employeeId)).thenReturn(leaves);

        ResponseEntity<List<LeaveDto>> response = leaveController.getLeavesByEmployee(employeeId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(leaves, response.getBody());
        verify(leaveService).getLeavesByEmployee(employeeId);
    }

    @Test
    void getLeaveById() {
        Long leaveId = 1L;
        LeaveDto leaveDto = new LeaveDto();

        when(leaveService.getLeaveById(leaveId)).thenReturn(Optional.of(leaveDto));

        ResponseEntity<LeaveDto> response = leaveController.getLeaveById(leaveId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(leaveDto, response.getBody());
        verify(leaveService).getLeaveById(leaveId);
    }

    @Test
    void getAllLeave() {
        List<LeaveDto> leaves = List.of(new LeaveDto(), new LeaveDto());

        when(leaveService.getAllLeaves()).thenReturn(leaves);

        ResponseEntity<List<LeaveDto>> response = leaveController.getAllLeave();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(leaves, response.getBody());
        verify(leaveService).getAllLeaves();
    }

    @Test
    void deleteLeave() {
        Long leaveId = 1L;
        doNothing().when(leaveService).deleteLeave(leaveId);

        ResponseEntity<Void> response = leaveController.deleteLeave(leaveId);

        assertEquals(204, response.getStatusCodeValue()); // No Content
        verify(leaveService).deleteLeave(leaveId);
    }

    @Test
    void updateLeave() throws Exception {
        Long leaveId = 1L;
        LeaveDto leaveDto = new LeaveDto();

        String leaveDtoJson = "{\"id\":1}";
        MultipartFile leaveDoc = new MockMultipartFile("leaveDoc", "file.txt", "text/plain", "content".getBytes());

        when(objectMapper.readValue(leaveDtoJson, LeaveDto.class)).thenReturn(leaveDto);
        when(leaveService.updateLeave(leaveDto)).thenReturn(leaveDto);

        ResponseEntity<LeaveDto> response = leaveController.updateLeave(leaveId, leaveDtoJson, leaveDoc);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(leaveDto, response.getBody());
        verify(objectMapper).readValue(leaveDtoJson, LeaveDto.class);
        verify(leaveService).updateLeave(leaveDto);
    }
}

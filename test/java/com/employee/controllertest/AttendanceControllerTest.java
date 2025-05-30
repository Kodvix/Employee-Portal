package com.employee.controllertest;

import com.employee.controller.AttendanceController;
import com.employee.dto.AttendanceDto;
import com.employee.dto.PunchDto;
import com.employee.entity.EmployeeDao;
import com.employee.service.AttendanceService;
import com.employee.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AttendanceControllerTest {

    @Mock
    private AttendanceService attendanceService;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private AttendanceController attendanceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void markAttendance() {
        AttendanceDto dto = new AttendanceDto();
        dto.setEmployeeId(1L);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(new EmployeeDao()));
        when(attendanceService.markAttendance(dto)).thenReturn(dto);

        ResponseEntity<AttendanceDto> response = attendanceController.markAttendance(dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dto, response.getBody());
    }

    @Test
    void getAllAttendance() {
        List<AttendanceDto> list = List.of(new AttendanceDto());
        when(attendanceService.getAllAttendance()).thenReturn(list);

        ResponseEntity<List<AttendanceDto>> response = attendanceController.getAllAttendance();
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(list, response.getBody());
    }

    @Test
    void getAttendanceById() {
        AttendanceDto dto = new AttendanceDto();
        when(attendanceService.getAttendanceById(1L)).thenReturn(Optional.of(dto));

        ResponseEntity<AttendanceDto> response = attendanceController.getAttendanceById(1L);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dto, response.getBody());
    }

    @Test
    void updateAttendance() {
        AttendanceDto dto = new AttendanceDto();
        when(attendanceService.updateAttendance(1L, dto)).thenReturn(Optional.of(dto));

        ResponseEntity<AttendanceDto> response = attendanceController.updateAttendance(1L, dto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dto, response.getBody());
    }

    @Test
    void deleteAttendance() {
        when(attendanceService.deleteAttendance(1L)).thenReturn(true);

        ResponseEntity<Void> response = attendanceController.deleteAttendance(1L);
        assertEquals(204, response.getStatusCodeValue());
    }

    @Test
    void getAttendanceByEmployeeId() {
        List<AttendanceDto> list = List.of(new AttendanceDto());
        when(attendanceService.getAttendanceByEmployeeId(1L)).thenReturn(list);

        ResponseEntity<List<AttendanceDto>> response = attendanceController.getAttendanceByEmployeeId(1L);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(list, response.getBody());
    }

    @Test
    void getAttendanceByEmployeeIdAndDate() {
        List<AttendanceDto> list = List.of(new AttendanceDto());
        LocalDate date = LocalDate.now();
        when(attendanceService.getAttendanceByEmployeeIdAndDate(1L, date)).thenReturn(list);

        ResponseEntity<List<AttendanceDto>> response = attendanceController.getAttendanceByEmployeeIdAndDate(1L, date);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(list, response.getBody());
    }

    @Test
    void punchIn() {
        PunchDto punchDto = new PunchDto();
        AttendanceDto responseDto = new AttendanceDto();
        when(attendanceService.punchIn(punchDto)).thenReturn(responseDto);

        ResponseEntity<AttendanceDto> response = attendanceController.punchIn(punchDto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(responseDto, response.getBody());
    }

    @Test
    void punchOut() {
        PunchDto punchDto = new PunchDto();
        AttendanceDto responseDto = new AttendanceDto();
        when(attendanceService.punchOut(punchDto)).thenReturn(responseDto);

        ResponseEntity<AttendanceDto> response = attendanceController.punchOut(punchDto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(responseDto, response.getBody());
    }
}

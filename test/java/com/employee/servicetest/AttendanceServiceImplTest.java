package com.employee.servicetest;

import com.employee.dto.AttendanceDto;
import com.employee.dto.PunchDto;
import com.employee.entity.AttendanceDao;
import com.employee.entity.EmployeeDao;
import com.employee.mapper.AttendanceMapper;
import com.employee.repository.AttendanceRepository;
import com.employee.repository.EmployeeRepository;
import com.employee.service.AttendanceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class AttendanceServiceImplTest {

    @InjectMocks
    private AttendanceServiceImpl attendanceService;

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void markAttendance() {
        Long employeeId = 1L;
        AttendanceDto dto = new AttendanceDto();
        dto.setEmployeeId(employeeId);
        EmployeeDao employee = new EmployeeDao();
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(attendanceRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        AttendanceDto result = attendanceService.markAttendance(dto);
        assertNotNull(result);
        verify(employeeRepository).findById(employeeId);
        verify(attendanceRepository).save(any());
    }

    @Test
    void getAllAttendance() {
        EmployeeDao employee = new EmployeeDao();
        employee.setId(1L);

        AttendanceDao attendance1 = new AttendanceDao();
        attendance1.setEmployee(employee);
        attendance1.setDate(LocalDate.now());

        AttendanceDao attendance2 = new AttendanceDao();
        attendance2.setEmployee(employee);
        attendance2.setDate(LocalDate.now().minusDays(1));

        when(attendanceRepository.findAll()).thenReturn(List.of(attendance1, attendance2));

        List<AttendanceDto> result = attendanceService.getAllAttendance();

        assertEquals(2, result.size());
        verify(attendanceRepository).findAll();
    }


    @Test
    void getAttendanceById() {
        Long attendanceId = 1L;

        EmployeeDao employee = new EmployeeDao();
        employee.setId(10L);

        AttendanceDao attendance = new AttendanceDao();
        attendance.setId(attendanceId);
        attendance.setEmployee(employee);  // Important: non-null employee

        when(attendanceRepository.findById(attendanceId)).thenReturn(Optional.of(attendance));

        Optional<AttendanceDto> result = attendanceService.getAttendanceById(attendanceId);

        assertTrue(result.isPresent());
        assertEquals(attendanceId, result.get().getId());
        verify(attendanceRepository).findById(attendanceId);
    }


    @Test
    void updateAttendance() {
        Long id = 1L;
        Long employeeId = 2L;
        AttendanceDto dto = new AttendanceDto();
        dto.setEmployeeId(employeeId);
        dto.setDate(LocalDate.now());
        dto.setCheckIn(LocalTime.of(9, 0));
        dto.setCheckOut(LocalTime.of(18, 0));
        dto.setStatus(true);
        dto.setRemark("Remark");
        AttendanceDao existing = new AttendanceDao();
        EmployeeDao employee = new EmployeeDao();
        when(attendanceRepository.findById(id)).thenReturn(Optional.of(existing));
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(attendanceRepository.save(existing)).thenAnswer(i -> i.getArgument(0));
        Optional<AttendanceDto> result = attendanceService.updateAttendance(id, dto);
        assertTrue(result.isPresent());
        verify(attendanceRepository).findById(id);
        verify(employeeRepository).findById(employeeId);
        verify(attendanceRepository).save(existing);
    }

    @Test
    void deleteAttendance() {
        Long id = 1L;
        when(attendanceRepository.existsById(id)).thenReturn(true);
        doNothing().when(attendanceRepository).deleteById(id);
        boolean result = attendanceService.deleteAttendance(id);
        assertTrue(result);
        verify(attendanceRepository).existsById(id);
        verify(attendanceRepository).deleteById(id);
    }

    @Test
    void getAttendanceByEmployeeId() {
        Long employeeId = 1L;
        EmployeeDao employee = new EmployeeDao();
        employee.setId(employeeId);

        AttendanceDao attendance1 = new AttendanceDao();
        attendance1.setEmployee(employee);

        AttendanceDao attendance2 = new AttendanceDao();
        attendance2.setEmployee(employee);

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(attendanceRepository.findByEmployee(employee)).thenReturn(List.of(attendance1, attendance2));

        List<AttendanceDto> result = attendanceService.getAttendanceByEmployeeId(employeeId);

        assertEquals(2, result.size());
        verify(employeeRepository).findById(employeeId);
        verify(attendanceRepository).findByEmployee(employee);
    }


    @Test
    void getAttendanceByEmployeeIdAndDate() {
        Long employeeId = 1L;
        LocalDate date = LocalDate.of(2025, 5, 29);

        EmployeeDao employee = new EmployeeDao();
        employee.setId(employeeId);

        AttendanceDao attendance1 = new AttendanceDao();
        attendance1.setEmployee(employee);
        attendance1.setDate(date);

        AttendanceDao attendance2 = new AttendanceDao();
        attendance2.setEmployee(employee);
        attendance2.setDate(date);

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(attendanceRepository.findByEmployeeAndDate(employee, date)).thenReturn(List.of(attendance1, attendance2));

        List<AttendanceDto> result = attendanceService.getAttendanceByEmployeeIdAndDate(employeeId, date);

        assertEquals(2, result.size());
        verify(employeeRepository).findById(employeeId);
        verify(attendanceRepository).findByEmployeeAndDate(employee, date);
    }


    @Test
    void punchIn() {
        Long employeeId = 1L;
        PunchDto dto = new PunchDto();
        dto.setEmployeeId(employeeId);
        dto.setTime(LocalTime.of(9, 0));
        EmployeeDao employee = new EmployeeDao();
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(attendanceRepository.findByEmployeeAndDate(eq(employee), any(LocalDate.class))).thenReturn(Collections.emptyList());
        when(attendanceRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        AttendanceDto result = attendanceService.punchIn(dto);
        assertNotNull(result);
        verify(attendanceRepository).save(any());
    }

    @Test
    void punchOut() {
        Long employeeId = 1L;
        PunchDto dto = new PunchDto();
        dto.setEmployeeId(employeeId);
        dto.setTime(LocalTime.of(18, 0));
        EmployeeDao employee = new EmployeeDao();
        AttendanceDao existing = AttendanceDao.builder().employee(employee).date(LocalDate.now()).build();
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(attendanceRepository.findByEmployeeAndDate(eq(employee), any(LocalDate.class))).thenReturn(List.of(existing));
        when(attendanceRepository.save(existing)).thenAnswer(i -> i.getArgument(0));
        AttendanceDto result = attendanceService.punchOut(dto);
        assertNotNull(result);
        verify(attendanceRepository).save(existing);
    }
}

package com.employee.servicetest;

import com.employee.dto.LeaveDto;
import com.employee.entity.EmployeeDao;
import com.employee.entity.LeaveDao;
import com.employee.mapper.LeaveMapper;
import com.employee.repository.EmployeeRepository;
import com.employee.repository.LeaveRepository;
import com.employee.service.LeaveServiceImpl;

import jakarta.inject.Inject;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LeaveServiceImplTest {

	@Autowired
	LeaveRepository leaveRepository;

	@Autowired
	EmployeeRepository employeeRepository;

	@Autowired
	ModelMapper modelMapper;

    private LeaveServiceImpl leaveService;

    private void inject(Object target, String fieldName, Object toInject) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, toInject);
    }
    
    @BeforeEach
    void setUp() throws Exception {
    	
        leaveRepository = mock(LeaveRepository.class);
        employeeRepository = mock(EmployeeRepository.class);
        modelMapper = new ModelMapper();

        leaveService = new LeaveServiceImpl();

        inject(leaveService, "leaveRepository", leaveRepository);
        inject(leaveService, "employeeRepository", employeeRepository);
        inject(leaveService, "modelMapper", modelMapper);
    }

    @Test
    void applyLeave() {
        Long employeeId = 1L;
        LeaveDto leaveDto = new LeaveDto();
        leaveDto.setLeaveType("Annual");
        leaveDto.setStartDate(LocalDate.now());
        leaveDto.setEndDate(LocalDate.now().plusDays(3));

        EmployeeDao employee = new EmployeeDao();
        employee.setId(employeeId);

        LeaveDao leaveDao = LeaveMapper.toEntity(leaveDto, employee);
        LeaveDao savedLeave = LeaveMapper.toEntity(leaveDto, employee);
        savedLeave.setId(100L);

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(leaveRepository.save(any(LeaveDao.class))).thenReturn(savedLeave);

        LeaveDto result = leaveService.applyLeave(employeeId, leaveDto);

        assertNotNull(result);
        assertEquals(savedLeave.getId(), result.getId());
        verify(employeeRepository).findById(employeeId);
        verify(leaveRepository).save(any(LeaveDao.class));
    }

    @Test
    void getAllLeaves() {
        LeaveDao leave1 = new LeaveDao();
        leave1.setId(1L);
        LeaveDao leave2 = new LeaveDao();
        leave2.setId(2L);
        List<LeaveDao> leaves = Arrays.asList(leave1, leave2);

        when(leaveRepository.findAll()).thenReturn(leaves);

        List<LeaveDto> result = leaveService.getAllLeaves();

        assertEquals(2, result.size());
        verify(leaveRepository).findAll();
    }

    @Test
    void getLeavesByEmployee() {
        Long employeeId = 1L;

        EmployeeDao employee = new EmployeeDao();
        employee.setId(employeeId);
        employee.setFirstName("John");

        LeaveDao leave1 = new LeaveDao();
        leave1.setId(100L);
        leave1.setEmployee(employee);
        leave1.setLeaveType("Vacation");
        // ... set other leave1 fields

        LeaveDao leave2 = new LeaveDao();
        leave2.setId(101L);
        leave2.setEmployee(employee);
        leave2.setLeaveType("Sick Leave");
        // ... set other leave2 fields

        List<LeaveDao> leaves = Arrays.asList(leave1, leave2);

        when(leaveRepository.findByEmployeeId(employeeId)).thenReturn(leaves);

        List<LeaveDto> leaveDtos = leaveService.getLeavesByEmployee(employeeId);

        assertEquals(2, leaveDtos.size());
        // Additional asserts as needed
    }


    @Test
    void getLeaveById() {
        Long leaveId = 1L;

        EmployeeDao employee = new EmployeeDao();
        employee.setId(10L);
        employee.setFirstName("John");

        LeaveDao leaveDao = new LeaveDao();
        leaveDao.setId(leaveId);
        leaveDao.setEmployee(employee);
        leaveDao.setLeaveType("Vacation");
        // ... set other LeaveDao fields as needed

        when(leaveRepository.findById(leaveId)).thenReturn(Optional.of(leaveDao));

        Optional<LeaveDto> leaveDtoOpt = leaveService.getLeaveById(leaveId);

        assertTrue(leaveDtoOpt.isPresent());
        LeaveDto leaveDto = leaveDtoOpt.get();
        assertEquals(leaveId, leaveDto.getId());
        // add other assertions as needed
    }

    @Test
    void deleteLeave() {
        Long leaveId = 7L;

        doNothing().when(leaveRepository).deleteById(leaveId);

        leaveService.deleteLeave(leaveId);

        verify(leaveRepository).deleteById(leaveId);
    }

    @Test
    void updateLeave() {
    	EmployeeDao employee = new EmployeeDao();
    	employee.setId(1L);
    	employee.setFirstName("John");
    	// set other required employee fields

    	LeaveDao leaveDao = new LeaveDao();
    	leaveDao.setId(10L);
    	leaveDao.setEmployee(employee);  // <-- Important!
    	leaveDao.setLeaveType("Sick Leave");
    	leaveDao.setStartDate(LocalDate.of(2025, 5, 1));
    	leaveDao.setEndDate(LocalDate.of(2025, 5, 5));
    	// set other fields as needed
    }
}

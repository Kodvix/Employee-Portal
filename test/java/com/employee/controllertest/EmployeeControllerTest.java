package com.employee.controllertest;

import com.employee.controller.EmployeeController;
import com.employee.dto.EmployeeDto;
import com.employee.entity.EmployeeDao;
import com.employee.mapper.EmployeeMapper;
import com.employee.service.EmployeeService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmployeeControllerTest {

    @Mock
    private EmployeeService employeeService;

    @Mock
    private EmployeeMapper employeeMapper;

    @InjectMocks
    private EmployeeController employeeController;

    private EmployeeDto employeeDto;
    private EmployeeDao employeeDao;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        employeeDto = new EmployeeDto();
        employeeDto.setId(1L);
        employeeDto.setFirstName("John");
        employeeDto.setLastName("Doe");
        employeeDto.setEmail("john@example.com");
        employeeDto.setPhone("1234567890");
        employeeDto.setDepartment("IT");
        employeeDto.setJobTitle("Developer");
        employeeDto.setStatus("Active");

        employeeDao = new EmployeeDao();
        employeeDao.setId(1L);
        employeeDao.setFirstName("John");
        employeeDao.setLastName("Doe");
        employeeDao.setEmail("john@example.com");
        employeeDao.setPhone("1234567890");
        employeeDao.setDepartment("IT");
        employeeDao.setJobTitle("Developer");
        employeeDao.setStatus("Active");
    }

    @Test
    void createEmployee() {
        // Scenario: Email does not exist, create employee successfully
        when(employeeService.emailExists(employeeDto.getEmail())).thenReturn(false);
        when(employeeMapper.toEntity(employeeDto)).thenReturn(employeeDao);
        when(employeeService.saveEmployee(employeeDao)).thenReturn(employeeDao);
        when(employeeMapper.toDto(employeeDao)).thenReturn(employeeDto);

        ResponseEntity<EmployeeDto> response = employeeController.createEmployee(employeeDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(employeeDto, response.getBody());
    }

  
    @Test
    void getAllEmployees() {
        List<EmployeeDao> daoList = Arrays.asList(employeeDao);
        List<EmployeeDto> dtoList = Arrays.asList(employeeDto);

        when(employeeService.getAllEmployees()).thenReturn(daoList);
        when(employeeMapper.toDto(employeeDao)).thenReturn(employeeDto);

        ResponseEntity<List<EmployeeDto>> response = employeeController.getAllEmployees();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dtoList, response.getBody());
    }

    @Test
    void getEmployeeById() {
        when(employeeService.getEmployeeById(1L)).thenReturn(Optional.of(employeeDao));
        when(employeeMapper.toDto(employeeDao)).thenReturn(employeeDto);

        ResponseEntity<EmployeeDto> response = employeeController.getEmployeeById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(employeeDto, response.getBody());
    }

    

    @Test
    void updateEmployee() {
        when(employeeService.getEmployeeById(1L)).thenReturn(Optional.of(employeeDao));
        when(employeeService.saveEmployee(any(EmployeeDao.class))).thenReturn(employeeDao);
        when(employeeMapper.toDto(employeeDao)).thenReturn(employeeDto);

        ResponseEntity<EmployeeDto> response = employeeController.updateEmployee(1L, employeeDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(employeeDto, response.getBody());
    }

   

    @Test
    void deleteEmployee() {
        when(employeeService.getEmployeeById(1L)).thenReturn(Optional.of(employeeDao));
        doNothing().when(employeeService).deleteEmployee(1L);

        ResponseEntity<String> response = employeeController.deleteEmployee(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Employee Deleted Successfully", response.getBody());
    }


    @Test
    void getEmployeeByEmail() {
        when(employeeService.getEmployeeByEmail("john@example.com")).thenReturn(Optional.of(employeeDao));
        when(employeeMapper.toDto(employeeDao)).thenReturn(employeeDto);

        ResponseEntity<EmployeeDto> response = employeeController.getEmployeeByEmail("john@example.com");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(employeeDto, response.getBody());
    }

    @Test
    void getByDepartment() {
        List<EmployeeDao> daoList = Arrays.asList(employeeDao);
        List<EmployeeDto> dtoList = Arrays.asList(employeeDto);

        when(employeeService.getEmployeesByDepartment("IT")).thenReturn(daoList);
        when(employeeMapper.toDto(employeeDao)).thenReturn(employeeDto);

        ResponseEntity<List<EmployeeDto>> response = employeeController.getByDepartment("IT");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(dtoList, response.getBody());
    }
}

package com.employee.servicetest;

import com.employee.entity.EmployeeDao;
import com.employee.repository.EmployeeRepository;
import com.employee.service.EmployeeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmployeeServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveEmployee() {
        EmployeeDao employee = new EmployeeDao();
        employee.setId(1L);
        employee.setEmail("test@example.com");

        when(employeeRepository.save(employee)).thenReturn(employee);

        EmployeeDao saved = employeeService.saveEmployee(employee);

        assertNotNull(saved);
        assertEquals(1L, saved.getId());
        verify(employeeRepository).save(employee);
    }

    @Test
    void getAllEmployees() {
        List<EmployeeDao> employees = List.of(new EmployeeDao(), new EmployeeDao());
        when(employeeRepository.findAll()).thenReturn(employees);

        List<EmployeeDao> result = employeeService.getAllEmployees();

        assertEquals(2, result.size());
        verify(employeeRepository).findAll();
    }

    @Test
    void getEmployeeById() {
        EmployeeDao employee = new EmployeeDao();
        employee.setId(1L);

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        Optional<EmployeeDao> result = employeeService.getEmployeeById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(employeeRepository).findById(1L);
    }

    @Test
    void deleteEmployee() {
        Long id = 1L;

        doNothing().when(employeeRepository).deleteById(id);

        employeeService.deleteEmployee(id);

        verify(employeeRepository).deleteById(id);
    }

    @Test
    void emailExists() {
        String email = "test@example.com";

        when(employeeRepository.existsByEmail(email)).thenReturn(true);

        boolean exists = employeeService.emailExists(email);

        assertTrue(exists);
        verify(employeeRepository).existsByEmail(email);
    }

    @Test
    void getEmployeeByEmail() {
        String email = "test@example.com";
        EmployeeDao employee = new EmployeeDao();
        employee.setEmail(email);

        when(employeeRepository.findByEmail(email)).thenReturn(Optional.of(employee));

        Optional<EmployeeDao> result = employeeService.getEmployeeByEmail(email);

        assertTrue(result.isPresent());
        assertEquals(email, result.get().getEmail());
        verify(employeeRepository).findByEmail(email);
    }

    @Test
    void getEmployeesByDepartment() {
        String dept = "IT";
        List<EmployeeDao> employees = List.of(new EmployeeDao(), new EmployeeDao());

        when(employeeRepository.findByDepartment(dept)).thenReturn(employees);

        List<EmployeeDao> result = employeeService.getEmployeesByDepartment(dept);

        assertEquals(2, result.size());
        verify(employeeRepository).findByDepartment(dept);
    }
}

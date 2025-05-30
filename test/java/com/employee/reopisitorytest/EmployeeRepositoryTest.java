package com.employee.reopisitorytest;

import com.employee.entity.EmployeeDao;
import com.employee.repository.EmployeeRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class EmployeeRepositoryTest {

    @Mock
    private EmployeeRepository employeeRepository;

    private EmployeeDao mockEmployee;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

       
        mockEmployee = EmployeeDao.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phone("1234567890")
                .department("IT")
                .jobTitle("Software Engineer")
                .salary(80000.0)
                .hireDate(LocalDateTime.now())
                .status("Active")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    public void testFindByEmail() {

        when(employeeRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(mockEmployee));


        Optional<EmployeeDao> result = employeeRepository.findByEmail("john.doe@example.com");


        assertTrue(result.isPresent());
        assertEquals("John", result.get().getFirstName());


        verify(employeeRepository, times(1)).findByEmail("john.doe@example.com");
    }

    @Test
    public void testFindByPhone() {

        when(employeeRepository.findByPhone("1234567890")).thenReturn(Optional.of(mockEmployee));


        Optional<EmployeeDao> result = employeeRepository.findByPhone("1234567890");


        assertTrue(result.isPresent());
        assertEquals("John", result.get().getFirstName());


        verify(employeeRepository, times(1)).findByPhone("1234567890");
    }

    @Test
    public void testExistsByEmail() {

        when(employeeRepository.existsByEmail("john.doe@example.com")).thenReturn(true);


        boolean exists = employeeRepository.existsByEmail("john.doe@example.com");

        assertTrue(exists);

        verify(employeeRepository, times(1)).existsByEmail("john.doe@example.com");
    }

    @Test
    public void testFindByDepartment() {

        when(employeeRepository.findByDepartment("IT")).thenReturn(Arrays.asList(mockEmployee));


        List<EmployeeDao> employees = employeeRepository.findByDepartment("IT");


        assertNotNull(employees);
        assertEquals(1, employees.size());
        assertEquals("John", employees.get(0).getFirstName());


        verify(employeeRepository, times(1)).findByDepartment("IT");
    }

    @Test
    public void testSaveEmployee() {

        when(employeeRepository.save(mockEmployee)).thenReturn(mockEmployee);


        EmployeeDao savedEmployee = employeeRepository.save(mockEmployee);


        assertNotNull(savedEmployee);
        assertEquals("John", savedEmployee.getFirstName());
        assertEquals("IT", savedEmployee.getDepartment());


        verify(employeeRepository, times(1)).save(mockEmployee);
    }

    @Test
    public void testDeleteEmployee() {

        employeeRepository.delete(mockEmployee);


        verify(employeeRepository, times(1)).delete(mockEmployee);
    }

    @Test
    public void testFindById() {

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(mockEmployee));

        Optional<EmployeeDao> result = employeeRepository.findById(1L);
        assertTrue(result.isPresent());
        assertEquals("John", result.get().getFirstName());

        verify(employeeRepository, times(1)).findById(1L);
    }
}
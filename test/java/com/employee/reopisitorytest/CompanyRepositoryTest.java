package com.employee.reopisitorytest;

import com.employee.entity.CompanyDao;
import com.employee.repository.CompanyRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CompanyRepositoryTest {

    @Mock
    private CompanyRepository companyRepository; // Mocked repository

    private CompanyDao mockCompany1;
    private CompanyDao mockCompany2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create mock companies
        mockCompany1 = new CompanyDao();
        mockCompany1.setId(1L);
        mockCompany1.setName("Tech Corp");
        mockCompany1.setAddress("123 Tech Street");
        mockCompany1.setPhoneNumber("1234567890");
        mockCompany1.setEmail("contact@techcorp.com");
        mockCompany1.setWebsiteUrl("www.techcorp.com");

        mockCompany2 = new CompanyDao();
        mockCompany2.setId(2L);
        mockCompany2.setName("Innovate Solutions");
        mockCompany2.setAddress("456 Innovation Blvd");
        mockCompany2.setPhoneNumber("9876543210");
        mockCompany2.setEmail("info@innovatesolutions.com");
        mockCompany2.setWebsiteUrl("www.innovatesolutions.com");
    }

    @Test
    void testFindById() {
        // Mock the behavior of findById
        when(companyRepository.findById(1L)).thenReturn(Optional.of(mockCompany1));

        // Call the method
        Optional<CompanyDao> result = companyRepository.findById(1L);

        // Assertions
        assertTrue(result.isPresent());
        assertEquals("Tech Corp", result.get().getName());
        assertEquals("123 Tech Street", result.get().getAddress());

        // Verify interaction
        verify(companyRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        // Mock the behavior of findById for a non-existent ID
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());

        // Call the method
        Optional<CompanyDao> result = companyRepository.findById(99L);

        // Assertions
        assertTrue(result.isEmpty());

        // Verify interaction
        verify(companyRepository, times(1)).findById(99L);
    }

    @Test
    void testFindAll() {
        // Mock the behavior of findAll
        when(companyRepository.findAll()).thenReturn(Arrays.asList(mockCompany1, mockCompany2));

        // Call the method
        List<CompanyDao> result = companyRepository.findAll();

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Tech Corp", result.get(0).getName());
        assertEquals("Innovate Solutions", result.get(1).getName());

        // Verify interaction
        verify(companyRepository, times(1)).findAll();
    }

    @Test
    void testSaveCompany() {
        // Mock the behavior of save
        when(companyRepository.save(mockCompany1)).thenReturn(mockCompany1);

        // Call the method
        CompanyDao savedCompany = companyRepository.save(mockCompany1);

        // Assertions
        assertNotNull(savedCompany);
        assertEquals("Tech Corp", savedCompany.getName());
        assertEquals("123 Tech Street", savedCompany.getAddress());

        // Verify interaction
        verify(companyRepository, times(1)).save(mockCompany1);
    }

    @Test
    void testDeleteCompany() {
        // Perform delete operation
        companyRepository.delete(mockCompany1);

        // Verify interaction
        verify(companyRepository, times(1)).delete(mockCompany1);
    }
}
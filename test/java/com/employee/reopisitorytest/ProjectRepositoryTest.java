package com.employee.reopisitorytest;

import com.employee.entity.CompanyDao;
import com.employee.entity.ProjectDao;
import com.employee.repository.ProjectRepository;
import com.employee.dto.ProjectStatus;
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

class ProjectRepositoryTest {

    @Mock
    private ProjectRepository projectRepository; // Mocked repository

    private ProjectDao mockProject1;
    private ProjectDao mockProject2;
    private CompanyDao mockCompany;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create mock Company
        mockCompany = new CompanyDao();
        mockCompany.setId(1L);
        mockCompany.setName("Tech Solutions");
        mockCompany.setAddress("123 Tech Street");
        mockCompany.setPhoneNumber("1234567890");
        mockCompany.setEmail("info@techsolutions.com");

        // Create mock Projects
        mockProject1 = ProjectDao.builder()
                .id(1L)
                .name("New Website Development")
                .description("Develop a new website for the company")
                .startDate(LocalDate.of(2025, 5, 1))
                .endDate(LocalDate.of(2025, 8, 1))
                .status(ProjectStatus.IN_PROGRESS)
                .company(mockCompany)
                .build();

        mockProject2 = ProjectDao.builder()
                .id(2L)
                .name("Mobile App Launch")
                .description("Launch a new mobile app for e-commerce")
                .startDate(LocalDate.of(2025, 6, 1))
                .endDate(LocalDate.of(2025, 9, 1))
                .status(ProjectStatus.PLANNED)
                .company(mockCompany)
                .build();
    }

    @Test
    void testFindByCompanyId() {
        // Mock the behavior of findByCompanyId
        when(projectRepository.findByCompanyId(1L)).thenReturn(Arrays.asList(mockProject1, mockProject2));

        // Call the method
        List<ProjectDao> result = projectRepository.findByCompanyId(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("New Website Development", result.get(0).getName());
        assertEquals("Mobile App Launch", result.get(1).getName());

        // Verify interaction
        verify(projectRepository, times(1)).findByCompanyId(1L);
    }

    @Test
    void testFindById() {
        // Mock the behavior of findById
        when(projectRepository.findById(1L)).thenReturn(Optional.of(mockProject1));

        // Call the method
        Optional<ProjectDao> result = projectRepository.findById(1L);

        // Assertions
        assertTrue(result.isPresent());
        assertEquals("New Website Development", result.get().getName());
        assertEquals(ProjectStatus.IN_PROGRESS, result.get().getStatus());

        // Verify interaction
        verify(projectRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        // Mock the behavior of findById for a non-existent ID
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        // Call the method
        Optional<ProjectDao> result = projectRepository.findById(99L);

        // Assertions
        assertTrue(result.isEmpty());

        // Verify interaction
        verify(projectRepository, times(1)).findById(99L);
    }

    @Test
    void testFindAll() {
        // Mock the behavior of findAll
        when(projectRepository.findAll()).thenReturn(Arrays.asList(mockProject1, mockProject2));

        // Call the method
        List<ProjectDao> result = projectRepository.findAll();

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("New Website Development", result.get(0).getName());
        assertEquals("Mobile App Launch", result.get(1).getName());

        // Verify interaction
        verify(projectRepository, times(1)).findAll();
    }

    @Test
    void testSaveProject() {
        // Mock the behavior of save
        when(projectRepository.save(mockProject1)).thenReturn(mockProject1);

        // Call the method
        ProjectDao savedProject = projectRepository.save(mockProject1);

        // Assertions
        assertNotNull(savedProject);
        assertEquals("New Website Development", savedProject.getName());
        assertEquals(ProjectStatus.IN_PROGRESS, savedProject.getStatus());

        // Verify interaction
        verify(projectRepository, times(1)).save(mockProject1);
    }

    @Test
    void testDeleteProject() {
        // Perform delete operation
        projectRepository.delete(mockProject1);

        // Verify interaction
        verify(projectRepository, times(1)).delete(mockProject1);
    }
}
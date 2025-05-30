package com.employee.reopisitorytest;

import com.employee.entity.HRComplaintDao;
import com.employee.repository.HRComplaintRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HRComplaintRepositoryTest {

    @Mock
    private HRComplaintRepository hrComplaintRepository; // Mocked repository

    private HRComplaintDao mockComplaint1;
    private HRComplaintDao mockComplaint2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create mock HR complaint entities
        mockComplaint1 = new HRComplaintDao();
        mockComplaint1.setId(1L);
        mockComplaint1.setType("Harassment");
        mockComplaint1.setDescription("A complaint about workplace harassment");
        mockComplaint1.setHrdoc(new byte[]{1, 2, 3});

        mockComplaint2 = new HRComplaintDao();
        mockComplaint2.setId(2L);
        mockComplaint2.setType("Discrimination");
        mockComplaint2.setDescription("A complaint about workplace discrimination");
        mockComplaint2.setHrdoc(new byte[]{4, 5, 6});
    }

    @Test
    void testFindById() {
        // Mock the behavior of findById
        when(hrComplaintRepository.findById(1L)).thenReturn(Optional.of(mockComplaint1));

        // Call the method
        Optional<HRComplaintDao> result = hrComplaintRepository.findById(1L);

        // Assertions
        assertTrue(result.isPresent());
        assertEquals("Harassment", result.get().getType());
        assertEquals("A complaint about workplace harassment", result.get().getDescription());

        // Verify interaction
        verify(hrComplaintRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        // Mock the behavior of findById for a non-existent ID
        when(hrComplaintRepository.findById(99L)).thenReturn(Optional.empty());

        // Call the method
        Optional<HRComplaintDao> result = hrComplaintRepository.findById(99L);

        // Assertions
        assertTrue(result.isEmpty());

        // Verify interaction
        verify(hrComplaintRepository, times(1)).findById(99L);
    }

    @Test
    void testFindAll() {
        // Mock the behavior of findAll
        when(hrComplaintRepository.findAll()).thenReturn(Arrays.asList(mockComplaint1, mockComplaint2));

        // Call the method
        List<HRComplaintDao> result = hrComplaintRepository.findAll();

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Harassment", result.get(0).getType());
        assertEquals("Discrimination", result.get(1).getType());

        // Verify interaction
        verify(hrComplaintRepository, times(1)).findAll();
    }

    @Test
    void testSaveComplaint() {
        // Mock the behavior of save
        when(hrComplaintRepository.save(mockComplaint1)).thenReturn(mockComplaint1);

        // Call the method
        HRComplaintDao savedComplaint = hrComplaintRepository.save(mockComplaint1);

        // Assertions
        assertNotNull(savedComplaint);
        assertEquals("Harassment", savedComplaint.getType());
        assertEquals("A complaint about workplace harassment", savedComplaint.getDescription());

        // Verify interaction
        verify(hrComplaintRepository, times(1)).save(mockComplaint1);
    }

    @Test
    void testDeleteComplaint() {
        // Perform delete operation
        hrComplaintRepository.delete(mockComplaint1);

        // Verify interaction
        verify(hrComplaintRepository, times(1)).delete(mockComplaint1);
    }
}
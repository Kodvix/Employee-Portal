package com.employee.reopisitorytest;

import com.employee.entity.CompanyDocumentsDao;
import com.employee.repository.CompanyDocumentRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CompanyDocumentRepositoryTest {

    @Mock
    private CompanyDocumentRepository companyDocumentRepository; // Mocked repository

    private CompanyDocumentsDao mockDocument1;
    private CompanyDocumentsDao mockDocument2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create mock documents
        mockDocument1 = new CompanyDocumentsDao();
        mockDocument1.setId(1L);
        mockDocument1.setEmpId(101L);
        mockDocument1.setOfferLetterDoc(new byte[]{1, 2, 3});
        mockDocument1.setLatestPaySlipDoc(new byte[]{4, 5, 6});
        mockDocument1.setDoc(new byte[]{7, 8, 9});

        mockDocument2 = new CompanyDocumentsDao();
        mockDocument2.setId(2L);
        mockDocument2.setEmpId(102L);
        mockDocument2.setOfferLetterDoc(new byte[]{10, 11, 12});
        mockDocument2.setLatestPaySlipDoc(new byte[]{13, 14, 15});
        mockDocument2.setDoc(new byte[]{16, 17, 18});
    }

    @Test
    void testFindByEmpId() {
        // Mock the behavior of findByEmpId
        when(companyDocumentRepository.findByEmpId(101L)).thenReturn(Arrays.asList(mockDocument1));

        // Call the method
        List<CompanyDocumentsDao> result = companyDocumentRepository.findByEmpId(101L);

        // Assertions
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(101L, result.get(0).getEmpId());
        assertArrayEquals(new byte[]{1, 2, 3}, result.get(0).getOfferLetterDoc());

        // Verify interaction
        verify(companyDocumentRepository, times(1)).findByEmpId(101L);
    }

    @Test
    void testSaveCompanyDocument() {
        // Mock the behavior of save
        when(companyDocumentRepository.save(mockDocument1)).thenReturn(mockDocument1);

        // Call the method
        CompanyDocumentsDao savedDocument = companyDocumentRepository.save(mockDocument1);

        // Assertions
        assertNotNull(savedDocument);
        assertEquals(101L, savedDocument.getEmpId());
        assertArrayEquals(new byte[]{1, 2, 3}, savedDocument.getOfferLetterDoc());

        // Verify interaction
        verify(companyDocumentRepository, times(1)).save(mockDocument1);
    }

    @Test
    void testFindById() {
        // Mock the behavior of findById
        when(companyDocumentRepository.findById(1L)).thenReturn(Optional.of(mockDocument1));

        // Call the method
        Optional<CompanyDocumentsDao> result = companyDocumentRepository.findById(1L);

        // Assertions
        assertTrue(result.isPresent());
        assertEquals(101L, result.get().getEmpId());
        assertArrayEquals(new byte[]{1, 2, 3}, result.get().getOfferLetterDoc());

        // Verify interaction
        verify(companyDocumentRepository, times(1)).findById(1L);
    }

    
    @Test
    void testDeleteCompanyDocument() {
        // Perform delete operation
        companyDocumentRepository.delete(mockDocument1);

        // Verify interaction
        verify(companyDocumentRepository, times(1)).delete(mockDocument1);
    }

    @Test
    void testFindAll() {
        // Mock the behavior of findAll
        when(companyDocumentRepository.findAll()).thenReturn(Arrays.asList(mockDocument1, mockDocument2));

        // Call the method
        List<CompanyDocumentsDao> result = companyDocumentRepository.findAll();

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(101L, result.get(0).getEmpId());
        assertEquals(102L, result.get(1).getEmpId());

        // Verify interaction
        verify(companyDocumentRepository, times(1)).findAll();
    }
}
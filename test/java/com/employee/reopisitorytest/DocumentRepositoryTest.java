package com.employee.reopisitorytest;

import com.employee.entity.DocumentDao;
import com.employee.entity.EmployeeDao;
import com.employee.repository.DocumentRepository;

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

class DocumentRepositoryTest {

    @Mock
    private DocumentRepository documentRepository; // Mocked repository

    private DocumentDao mockDocument1;
    private DocumentDao mockDocument2;
    private EmployeeDao mockEmployee;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create mock Employee
        mockEmployee = new EmployeeDao();
        mockEmployee.setId(1L);
        mockEmployee.setFirstName("John");
        mockEmployee.setLastName("Doe");
        mockEmployee.setEmail("john.doe@example.com");

        // Create mock Documents
        mockDocument1 = DocumentDao.builder()
                .id(1L)
                .fileName("resume.pdf")
                .fileType("application/pdf")
                .data(new byte[]{1, 2, 3})
                .uploadTime(LocalDateTime.now())
                .employee(mockEmployee)
                .build();

        mockDocument2 = DocumentDao.builder()
                .id(2L)
                .fileName("cover_letter.docx")
                .fileType("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                .data(new byte[]{4, 5, 6})
                .uploadTime(LocalDateTime.now())
                .employee(mockEmployee)
                .build();
    }

    @Test
    void testFindByEmployeeId() {
        // Mock the behavior of findByEmployeeId
        when(documentRepository.findByEmployeeId(1L)).thenReturn(Arrays.asList(mockDocument1, mockDocument2));

        // Call the method
        List<DocumentDao> result = documentRepository.findByEmployeeId(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("resume.pdf", result.get(0).getFileName());
        assertEquals("cover_letter.docx", result.get(1).getFileName());

        // Verify interaction
        verify(documentRepository, times(1)).findByEmployeeId(1L);
    }

    @Test
    void testSaveDocument() {
        // Mock the behavior of save
        when(documentRepository.save(mockDocument1)).thenReturn(mockDocument1);

        // Call the method
        DocumentDao savedDocument = documentRepository.save(mockDocument1);

        // Assertions
        assertNotNull(savedDocument);
        assertEquals("resume.pdf", savedDocument.getFileName());
        assertEquals("application/pdf", savedDocument.getFileType());

        // Verify interaction
        verify(documentRepository, times(1)).save(mockDocument1);
    }

    @Test
    void testFindById() {
        // Mock the behavior of findById
        when(documentRepository.findById(1L)).thenReturn(Optional.of(mockDocument1));

        // Call the method
        Optional<DocumentDao> result = documentRepository.findById(1L);

        // Assertions
        assertTrue(result.isPresent());
        assertEquals("resume.pdf", result.get().getFileName());
        assertEquals("application/pdf", result.get().getFileType());

        // Verify interaction
        verify(documentRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        // Mock the behavior of findById for a non-existent ID
        when(documentRepository.findById(99L)).thenReturn(Optional.empty());

        // Call the method
        Optional<DocumentDao> result = documentRepository.findById(99L);

        // Assertions
        assertTrue(result.isEmpty());

        // Verify interaction
        verify(documentRepository, times(1)).findById(99L);
    }

    @Test
    void testDeleteDocument() {
        // Perform delete operation
        documentRepository.delete(mockDocument1);

        // Verify interaction
        verify(documentRepository, times(1)).delete(mockDocument1);
    }
}
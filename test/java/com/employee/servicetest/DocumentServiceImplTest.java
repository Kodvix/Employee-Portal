package com.employee.servicetest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.employee.dto.DocumentDto;
import com.employee.entity.DocumentDao;
import com.employee.entity.EmployeeDao;
import com.employee.mapper.DocumentMapper;
import com.employee.repository.DocumentRepository;
import com.employee.repository.EmployeeRepository;
import com.employee.service.DocumentServiceImpl;

import io.jsonwebtoken.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

class DocumentServiceImplTest {

    @InjectMocks
    private DocumentServiceImpl service;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private MultipartFile multipartFile;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void uploadDocument() throws Exception {
        Long employeeId = 1L;
        EmployeeDao employee = EmployeeDao.builder().id(employeeId).build();

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(multipartFile.getOriginalFilename()).thenReturn("file.txt");
        when(multipartFile.getContentType()).thenReturn("text/plain");
        when(multipartFile.getBytes()).thenReturn("content".getBytes());

        DocumentDao savedDocument = DocumentDao.builder()
                .id(10L)
                .fileName("file.txt")
                .fileType("text/plain")
                .data("content".getBytes())
                .uploadTime(LocalDateTime.now())
                .employee(employee)
                .build();

        when(documentRepository.save(any(DocumentDao.class))).thenReturn(savedDocument);

        DocumentDto result = service.uploadDocument(employeeId, multipartFile);

        assertNotNull(result);
        assertEquals("file.txt", result.getName());
        verify(documentRepository).save(any(DocumentDao.class));
    }

    @Test
    void getDocumentsByEmployeeId() {
        Long employeeId = 1L;
        EmployeeDao employee = EmployeeDao.builder().id(employeeId).build();

        DocumentDao doc1 = DocumentDao.builder()
                .id(1L)
                .fileName("file1.txt")
                .employee(employee) // Set employee here
                .build();

        DocumentDao doc2 = DocumentDao.builder()
                .id(2L)
                .fileName("file2.txt")
                .employee(employee) // Set employee here
                .build();

        List<DocumentDao> documents = List.of(doc1, doc2);

        when(documentRepository.findByEmployeeId(employeeId)).thenReturn(documents);

        List<DocumentDto> dtos = service.getDocumentsByEmployeeId(employeeId);

        assertNotNull(dtos);
        assertEquals(2, dtos.size());
    }

    @Test
    void getDocument() {
        Long documentId = 1L;

        // Create an EmployeeDao with an ID
        EmployeeDao employee = EmployeeDao.builder().id(1L).build();

        DocumentDao document = DocumentDao.builder()
                .id(documentId)
                .fileName("file.txt")
                .employee(employee) // <-- Set employee here to avoid NPE
                .build();

        when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));

        DocumentDto dto = service.getDocument(documentId);

        assertNotNull(dto);
        assertEquals("file.txt", dto.getName());
    }

    @Test
    void updateDocument() throws IOException {
        Long documentId = 1L;

        EmployeeDao employee = EmployeeDao.builder()
                .id(1L)
                .build();

        DocumentDao existingDocument = DocumentDao.builder()
                .id(documentId)
                .fileName("oldFile.txt")
                .fileType("text/plain")
                .data("old data".getBytes())
                .employee(employee)   // Make sure employee is set here!
                .build();

        MultipartFile file = new MockMultipartFile(
                "file",
                "newFile.txt",
                "text/plain",
                "new data".getBytes()
        );

        when(documentRepository.findById(documentId)).thenReturn(Optional.of(existingDocument));
        when(documentRepository.save(any(DocumentDao.class))).thenAnswer(i -> i.getArgument(0));

        DocumentDto updatedDto = service.updateDocument(documentId, file);

        assertNotNull(updatedDto);
        assertEquals("newFile.txt", updatedDto.getName());
        assertEquals("text/plain", updatedDto.getType());
    }


    @Test
    void deleteDocument() {
        Long id = 1L;
        DocumentDao document = DocumentDao.builder().id(id).build();

        when(documentRepository.findById(id)).thenReturn(Optional.of(document));

        service.deleteDocument(id);

        verify(documentRepository).delete(document);
    }

    @Test
    void updateDocumentByEmployee() throws Exception {
        Long employeeId = 1L;
        Long documentId = 2L;

        EmployeeDao employee = EmployeeDao.builder().id(employeeId).build();

        DocumentDao document = DocumentDao.builder()
                .id(documentId)
                .employee(employee)
                .fileName("old.txt")
                .build();

        when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));

        when(multipartFile.getOriginalFilename()).thenReturn("updated.txt");
        when(multipartFile.getContentType()).thenReturn("text/plain");
        when(multipartFile.getBytes()).thenReturn("updated data".getBytes());

        when(documentRepository.save(document)).thenReturn(document);

        DocumentDto dto = service.updateDocumentByEmployee(employeeId, documentId, multipartFile);

        assertEquals("updated.txt", dto.getName());
        verify(documentRepository).save(document);
    }

    @Test
    void deleteDocumentByEmployee() {
        Long employeeId = 1L;
        Long documentId = 2L;

        EmployeeDao employee = EmployeeDao.builder().id(employeeId).build();

        DocumentDao document = DocumentDao.builder()
                .id(documentId)
                .employee(employee)
                .build();

        when(documentRepository.findById(documentId)).thenReturn(Optional.of(document));

        boolean deleted = service.deleteDocumentByEmployee(employeeId, documentId);

        assertTrue(deleted);
        verify(documentRepository).delete(document);
    }
}

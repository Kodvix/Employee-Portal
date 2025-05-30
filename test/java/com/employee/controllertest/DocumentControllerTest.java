package com.employee.controllertest;

import com.employee.controller.DocumentController;
import com.employee.dto.DocumentDto;
import com.employee.service.DocumentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class DocumentControllerTest {

    @Mock
    private DocumentService documentService;

    @InjectMocks
    private DocumentController documentController;

    private MultipartFile mockFile;
    private DocumentDto sampleDocument;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockFile = new MockMultipartFile(
                "file",
                "testfile.pdf",
                "application/pdf",
                "dummy content".getBytes());

        sampleDocument = new DocumentDto();
        sampleDocument.setId(1L);
        sampleDocument.setName("testfile.pdf");
        sampleDocument.setEmployeeId(10L);
    }

    @Test
    void uploadDocument() {
        when(documentService.uploadDocument(10L, mockFile)).thenReturn(sampleDocument);

        ResponseEntity<?> response = documentController.uploadDocument(10L, mockFile);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo("Document uploaded successfully: " + sampleDocument.getName());
        verify(documentService).uploadDocument(10L, mockFile);
    }

    @Test
    void getDocumentsByEmployee() {
        List<DocumentDto> list = List.of(sampleDocument);
        when(documentService.getDocumentsByEmployeeId(10L)).thenReturn(list);

        ResponseEntity<List<DocumentDto>> response = documentController.getDocumentsByEmployee(10L);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(list);
        verify(documentService).getDocumentsByEmployeeId(10L);
    }

    @Test
    void getDocument() {
        when(documentService.getDocument(1L)).thenReturn(sampleDocument);

        ResponseEntity<DocumentDto> response = documentController.getDocument(1L);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(sampleDocument);
        verify(documentService).getDocument(1L);
    }

    @Test
    void updateDocument() {
        when(documentService.updateDocument(1L, mockFile)).thenReturn(sampleDocument);

        ResponseEntity<?> response = documentController.updateDocument(1L, mockFile);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo("Document updated successfully: " + sampleDocument.getName());
        verify(documentService).updateDocument(1L, mockFile);
    }

    @Test
    void deleteDocument() {
        doNothing().when(documentService).deleteDocument(1L);

        ResponseEntity<?> response = documentController.deleteDocument(1L);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo("Document deleted successfully with ID: 1");
        verify(documentService).deleteDocument(1L);
    }

    @Test
    void updateDocumentByEmployee() {
        when(documentService.updateDocumentByEmployee(10L, 1L, mockFile)).thenReturn(sampleDocument);

        ResponseEntity<?> response = documentController.updateDocumentByEmployee(10L, 1L, mockFile);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody())
            .isEqualTo("Document updated for employee ID 10 with new file: " + sampleDocument.getName());
        verify(documentService).updateDocumentByEmployee(10L, 1L, mockFile);
    }

    @Test
    void deleteDocumentByEmployee() {
    	when(documentService.deleteDocumentByEmployee(10L, 1L)).thenReturn(true);

        ResponseEntity<?> response = documentController.deleteDocumentByEmployee(10L, 1L);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo("Document Deleted Successfully");
        verify(documentService).deleteDocumentByEmployee(10L, 1L);
    }

    // Exception cases below for methods with try-catch in controller


   


}

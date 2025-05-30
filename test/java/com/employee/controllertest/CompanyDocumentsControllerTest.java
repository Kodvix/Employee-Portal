package com.employee.controllertest;

import com.employee.controller.CompanyDocumentsController;
import com.employee.dto.CompanyDocumentsDto;
import com.employee.service.CompanyDocumentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CompanyDocumentsControllerTest {

    @Mock
    private CompanyDocumentService service;

    @InjectMocks
    private CompanyDocumentsController controller;

    private CompanyDocumentsDto sampleDto;
    private MultipartFile sampleFile;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        sampleDto = new CompanyDocumentsDto();
        sampleDto.setId(1L);
        sampleDto.setEmpId(100L);

        sampleFile = new MockMultipartFile(
                "file",
                "filename.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "some content".getBytes());
    }

    @Test
    void create() {
        when(service.save(eq(100L), any(), any(), any())).thenReturn(sampleDto);

        ResponseEntity<CompanyDocumentsDto> response = controller.create(100L, sampleFile, sampleFile, sampleFile);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(sampleDto);
        verify(service).save(eq(100L), any(), any(), any());
    }

    @Test
    void update() {
        when(service.update(eq(1L), eq(100L), any(), any(), any())).thenReturn(sampleDto);

        ResponseEntity<CompanyDocumentsDto> response = controller.update(1L, 100L, sampleFile, sampleFile, sampleFile);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(sampleDto);
        verify(service).update(eq(1L), eq(100L), any(), any(), any());
    }

    @Test
    void delete() {
        doNothing().when(service).delete(1L);

        ResponseEntity<Void> response = controller.delete(1L);

        assertThat(response.getStatusCodeValue()).isEqualTo(204);
        verify(service).delete(1L);
    }

    @Test
    void getById() {
        when(service.getById(1L)).thenReturn(sampleDto);

        ResponseEntity<CompanyDocumentsDto> response = controller.getById(1L);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(sampleDto);
        verify(service).getById(1L);
    }

   

    @Test
    void getByEmpId() {
        List<CompanyDocumentsDto> list = List.of(sampleDto);
        when(service.getByEmpId(100L)).thenReturn(list);

        ResponseEntity<List<CompanyDocumentsDto>> response = controller.getByEmpId(100L);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(list);
        verify(service).getByEmpId(100L);
    }

    @Test
    void getAll() {
        List<CompanyDocumentsDto> list = List.of(sampleDto);
        when(service.getAll()).thenReturn(list);

        ResponseEntity<List<CompanyDocumentsDto>> response = controller.getAll();

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(list);
        verify(service).getAll();
    }
}

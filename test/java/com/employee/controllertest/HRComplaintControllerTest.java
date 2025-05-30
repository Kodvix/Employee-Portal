package com.employee.controllertest;

import com.employee.controller.HRComplaintController;
import com.employee.dto.HRComplaintDto;
import com.employee.service.HRComplaintService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HRComplaintControllerTest {

    @Mock
    private HRComplaintService hrComplaintService;

    @InjectMocks
    private HRComplaintController hrComplaintController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createComplaint() throws IOException {
        MockMultipartFile file = new MockMultipartFile("file", "doc.txt", "text/plain", "content".getBytes());

        HRComplaintDto savedDto = new HRComplaintDto();
        savedDto.setType("Type1");
        savedDto.setDescription("Desc1");
        savedDto.setEmployeeId(1L);
        savedDto.setStatus("Pending");
        savedDto.setSubmittedDate(LocalDateTime.now());
        savedDto.setHrdoc(file.getBytes());

        when(hrComplaintService.saveComplaint(any(HRComplaintDto.class))).thenReturn(savedDto);

        ResponseEntity<HRComplaintDto> response = hrComplaintController.createComplaint(
                "Type1",
                "Desc1",
                1L,
                file
        );

        assertEquals(savedDto, response.getBody());
        assertEquals(200, response.getStatusCodeValue());
        verify(hrComplaintService, times(1)).saveComplaint(any(HRComplaintDto.class));
    }

   
  
    @Test
    void updateComplaint() throws IOException {
        MockMultipartFile file = new MockMultipartFile("file", "doc.txt", "text/plain", "content".getBytes());

        HRComplaintDto updatedDto = new HRComplaintDto();
        updatedDto.setType("TypeUpdated");
        updatedDto.setDescription("DescUpdated");
        updatedDto.setStatus("Resolved");
        updatedDto.setHrdoc(file.getBytes());

        when(hrComplaintService.updateComplaint(eq(1L), any(HRComplaintDto.class))).thenReturn(updatedDto);

        ResponseEntity<HRComplaintDto> response = hrComplaintController.updateComplaint(
                1L,
                "TypeUpdated",
                "DescUpdated",
                "Resolved",
                file
        );

        assertEquals(updatedDto, response.getBody());
        assertEquals(200, response.getStatusCodeValue());
        verify(hrComplaintService, times(1)).updateComplaint(eq(1L), any(HRComplaintDto.class));
    }

    


    @Test
    void getAllComplaints() {
        HRComplaintDto dto1 = new HRComplaintDto();
        HRComplaintDto dto2 = new HRComplaintDto();
        List<HRComplaintDto> list = Arrays.asList(dto1, dto2);

        when(hrComplaintService.getAllComplaints()).thenReturn(list);

        ResponseEntity<List<HRComplaintDto>> response = hrComplaintController.getAllComplaints();

        assertEquals(2, response.getBody().size());
        assertEquals(200, response.getStatusCodeValue());
        verify(hrComplaintService, times(1)).getAllComplaints();
    }

    @Test
    void getComplaintById() {
        HRComplaintDto dto = new HRComplaintDto();
        dto.setType("Type1");

        when(hrComplaintService.getComplaintById(1L)).thenReturn(dto);

        ResponseEntity<HRComplaintDto> response = hrComplaintController.getComplaintById(1L);

        assertEquals("Type1", response.getBody().getType());
        assertEquals(200, response.getStatusCodeValue());
        verify(hrComplaintService, times(1)).getComplaintById(1L);
    }

    @Test
    void deleteComplaint() {
        doNothing().when(hrComplaintService).deleteComplaint(1L);

        ResponseEntity<String> response = hrComplaintController.deleteComplaint(1L);

        assertEquals("Complaint deleted successfully", response.getBody());
        assertEquals(200, response.getStatusCodeValue());
        verify(hrComplaintService, times(1)).deleteComplaint(1L);
    }
}

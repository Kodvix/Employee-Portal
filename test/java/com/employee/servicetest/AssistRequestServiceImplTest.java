package com.employee.servicetest;

import com.employee.dto.AssistRequestDto;
import com.employee.entity.AssistRequestDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.repository.AssistRequestRepository;
import com.employee.service.AssistRequestServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AssistRequestServiceImplTest {

    @Mock
    private AssistRequestRepository assistRequestRepository;

    @InjectMocks
    private AssistRequestServiceImpl assistRequestService;

    private AssistRequestDao dao;
    private AssistRequestDto dto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        dao = new AssistRequestDao();
        dao.setId(1L);
        dao.setType("Laptop");
        dao.setJustification("Need for remote work");
        dao.setNeededByDate(LocalDate.of(2025, 6, 1));

        dto = new AssistRequestDto();
        dto.setType("Laptop");
        dto.setJustification("Need for remote work");
        dto.setNeededByDate(LocalDate.of(2025, 6, 1));
    }

    @Test
    void createAssistRequest() {
        when(assistRequestRepository.save(any())).thenReturn(dao);

        AssistRequestDto result = assistRequestService.createAssistRequest(dto);

        assertEquals("Laptop", result.getType());
        verify(assistRequestRepository, times(1)).save(any());
    }

    @Test
    void getAllAssistRequests() {
        when(assistRequestRepository.findAll()).thenReturn(Arrays.asList(dao));

        List<AssistRequestDto> result = assistRequestService.getAllAssistRequests();

        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getType());
        verify(assistRequestRepository, times(1)).findAll();
    }

    @Test
    void getAssistRequestById() {
        when(assistRequestRepository.findById(1L)).thenReturn(Optional.of(dao));

        AssistRequestDto result = assistRequestService.getAssistRequestById(1L);

        assertEquals("Laptop", result.getType());
        verify(assistRequestRepository, times(1)).findById(1L);
    }

    @Test
    void updateAssistRequest() {
        when(assistRequestRepository.findById(1L)).thenReturn(Optional.of(dao));
        when(assistRequestRepository.save(any())).thenReturn(dao);

        dto.setType("Monitor");
        dto.setJustification("For dual screen setup");
        dto.setNeededByDate(LocalDate.of(2025, 7, 1));

        AssistRequestDto result = assistRequestService.updateAssistRequest(1L, dto);

        assertEquals("Monitor", result.getType());
        verify(assistRequestRepository, times(1)).save(any());
    }

    @Test
    void deleteAssistRequest() {
        when(assistRequestRepository.findById(1L)).thenReturn(Optional.of(dao));

        boolean result = assistRequestService.deleteAssistRequest(1L);

        assertTrue(result);
        verify(assistRequestRepository, times(1)).delete(dao);
    }

   

   

    
} 

package com.employee.servicetest;

import com.employee.dto.HRComplaintDto;
import com.employee.entity.HRComplaintDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.mapper.HRComplaintMapper;
import com.employee.repository.HRComplaintRepository;
import com.employee.service.HRComplaintServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HRComplaintServiceImplTest {

    @InjectMocks
    private HRComplaintServiceImpl service;

    @Mock
    private HRComplaintRepository repository;

    @Mock
    private HRComplaintMapper mapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveComplaint() {
        HRComplaintDto dto = new HRComplaintDto();
        dto.setType("Abuse");
        dto.setDescription("Complaint about harassment");

        HRComplaintDao dao = new HRComplaintDao();
        dao.setType("Abuse");
        dao.setDescription("Complaint about harassment");
        dao.setSubmittedDate(LocalDateTime.now());
        dao.setStatus("Pending");

        HRComplaintDao saved = new HRComplaintDao();
        saved.setId(1L);
        saved.setType("Abuse");
        saved.setDescription("Complaint about harassment");
        saved.setSubmittedDate(dao.getSubmittedDate());
        saved.setStatus("Pending");

        HRComplaintDto resultDto = new HRComplaintDto();
        resultDto.setId(1L);
        resultDto.setType("Abuse");
        resultDto.setDescription("Complaint about harassment");
        resultDto.setStatus("Pending");

        when(mapper.toEntity(dto)).thenReturn(dao);
        when(repository.save(any())).thenReturn(saved);
        when(mapper.toDto(saved)).thenReturn(resultDto);

        HRComplaintDto result = service.saveComplaint(dto);

        assertNotNull(result);
        assertEquals("Abuse", result.getType());
        assertEquals("Pending", result.getStatus());
    }

    @Test
    void getAllComplaints() {
        List<HRComplaintDao> daoList = List.of(new HRComplaintDao(), new HRComplaintDao());
        when(repository.findAll()).thenReturn(daoList);
        when(mapper.toDto(any())).thenReturn(new HRComplaintDto());

        List<HRComplaintDto> result = service.getAllComplaints();

        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void updateComplaint() {
        Long id = 1L;
        HRComplaintDto dto = new HRComplaintDto();
        dto.setType("Updated Type");
        dto.setDescription("Updated Description");
        dto.setStatus("Resolved");

        HRComplaintDao existing = new HRComplaintDao();
        existing.setId(id);
        existing.setType("Old");
        existing.setDescription("Old desc");

        HRComplaintDao updatedDao = new HRComplaintDao();
        updatedDao.setId(id);
        updatedDao.setType("Updated Type");
        updatedDao.setDescription("Updated Description");
        updatedDao.setStatus("Resolved");

        HRComplaintDto updatedDto = new HRComplaintDto();
        updatedDto.setId(id);
        updatedDto.setType("Updated Type");
        updatedDto.setDescription("Updated Description");
        updatedDto.setStatus("Resolved");

        when(repository.findById(id)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(updatedDao);
        when(mapper.toDto(updatedDao)).thenReturn(updatedDto);

        HRComplaintDto result = service.updateComplaint(id, dto);

        assertEquals("Updated Type", result.getType());
        assertEquals("Resolved", result.getStatus());
    }

    @Test
    void getComplaintById() {
        Long id = 1L;
        HRComplaintDao dao = new HRComplaintDao();
        dao.setId(id);

        HRComplaintDto dto = new HRComplaintDto();
        dto.setId(id);

        when(repository.findById(id)).thenReturn(Optional.of(dao));
        when(mapper.toDto(dao)).thenReturn(dto);

        HRComplaintDto result = service.getComplaintById(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
    }

    @Test
    void deleteComplaint() {
        Long id = 1L;
        when(repository.existsById(id)).thenReturn(true);
        doNothing().when(repository).deleteById(id);

        assertDoesNotThrow(() -> service.deleteComplaint(id));
        verify(repository, times(1)).deleteById(id);
    }

  
}

package com.employee.servicetest;

import com.employee.dto.EventDto;
import com.employee.entity.EventDao;
import com.employee.exception.EventNotFoundException;
import com.employee.exception.InvalidEventDataException;
import com.employee.repository.EventRepository;
import com.employee.service.EventServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EventServiceImplTest {

    private EventRepository eventRepository;
    private ModelMapper modelMapper;
    private EventServiceImpl eventService;

    @BeforeEach
    void setUp() {
        eventRepository = mock(EventRepository.class);
        modelMapper = new ModelMapper();
        eventService = new EventServiceImpl();
        injectDependency(eventService, "eventRepository", eventRepository);
        injectDependency(eventService, "modelMapper", modelMapper);
    }

    private void injectDependency(Object target, String fieldName, Object value) {
        try {
            var field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private EventDto sampleEventDto(Long id) {
        EventDto dto = new EventDto();
        dto.setId(id);
        dto.setName("Annual Meetup");
        dto.setDescription("Company-wide annual meetup");
        dto.setDescription("Company-wide annual meetup");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        dto.setEventImage("image.jpg".getBytes(StandardCharsets.UTF_8));
        return dto;
    }

    private EventDao sampleEventDao(Long id) {
        EventDao dao = new EventDao();
        dao.setId(id);
        dao.setName("Annual Meetup");
        dao.setDescription("Company-wide annual meetup");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        dao.setDate(LocalDate.now().format(formatter));        
        
        dao.setEventImage("image.jpg".getBytes(StandardCharsets.UTF_8));
        return dao;
    }

    @Test
    void getAllEvents() {
        when(eventRepository.findAll()).thenReturn(List.of(sampleEventDao(1L), sampleEventDao(2L)));

        List<EventDto> result = eventService.getAllEvents();

        assertEquals(2, result.size());
        assertEquals("Annual Meetup", result.get(0).getName());
        verify(eventRepository).findAll();
    }

    @Test
    void getEventById() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEventDao(1L)));

        EventDto result = eventService.getEventById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(eventRepository).findById(1L);
    }

  

    @Test
    void createEvent() {
        EventDto dto = sampleEventDto(null);
        EventDao savedDao = sampleEventDao(1L);

        when(eventRepository.save(any(EventDao.class))).thenReturn(savedDao);

        EventDto result = eventService.createEvent(dto);

        assertNotNull(result);
        assertEquals("Annual Meetup", result.getName());
        verify(eventRepository).save(any(EventDao.class));
    }

   
    @Test
    void updateEvent() {
        EventDao existing = sampleEventDao(1L);
        EventDto updated = sampleEventDto(1L);
        updated.setName("Updated Event");

        when(eventRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(eventRepository.save(any(EventDao.class))).thenReturn(existing);

        EventDto result = eventService.updateEvent(1L, updated);

        assertEquals("Updated Event", result.getName());
        verify(eventRepository).findById(1L);
        verify(eventRepository).save(any(EventDao.class));
    }

   

    @Test
    void deleteEvent() {
        doNothing().when(eventRepository).deleteById(1L);

        eventService.deleteEvent(1L);

        verify(eventRepository).deleteById(1L);
    }
}

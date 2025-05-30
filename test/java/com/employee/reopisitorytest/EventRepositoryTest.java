package com.employee.reopisitorytest;

import com.employee.entity.EventDao;
import com.employee.repository.EventRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EventRepositoryTest {

    @Mock
    private EventRepository eventRepository; // Mocked repository

    private EventDao mockEvent1;
    private EventDao mockEvent2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create mock events
        mockEvent1 = EventDao.builder()
                .id(1L)
                .name("Annual Tech Conference")
                .description("A conference to discuss the latest in technology.")
                .date("2025-07-15")
                .location("Tech Park Auditorium")
                .build();

        mockEvent2 = EventDao.builder()
                .id(2L)
                .name("Employee Wellness Workshop")
                .description("A workshop to promote employee wellness.")
                .date("2025-08-20")
                .location("Wellness Center")
                .build();
    }

    @Test
    void testFindById() {
        // Mock the behavior of findById
        when(eventRepository.findById(1L)).thenReturn(Optional.of(mockEvent1));

        // Call the method
        Optional<EventDao> result = eventRepository.findById(1L);

        // Assertions
        assertTrue(result.isPresent());
        assertEquals("Annual Tech Conference", result.get().getName());
        assertEquals("2025-07-15", result.get().getDate());

        // Verify interaction
        verify(eventRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        // Mock the behavior of findById for a non-existent ID
        when(eventRepository.findById(99L)).thenReturn(Optional.empty());

        // Call the method
        Optional<EventDao> result = eventRepository.findById(99L);

        // Assertions
        assertTrue(result.isEmpty());

        // Verify interaction
        verify(eventRepository, times(1)).findById(99L);
    }

    @Test
    void testFindAll() {
        // Mock the behavior of findAll
        when(eventRepository.findAll()).thenReturn(Arrays.asList(mockEvent1, mockEvent2));

        // Call the method
        List<EventDao> result = eventRepository.findAll();

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Annual Tech Conference", result.get(0).getName());
        assertEquals("Employee Wellness Workshop", result.get(1).getName());

        // Verify interaction
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    void testSaveEvent() {
        // Mock the behavior of save
        when(eventRepository.save(mockEvent1)).thenReturn(mockEvent1);

        // Call the method
        EventDao savedEvent = eventRepository.save(mockEvent1);

        // Assertions
        assertNotNull(savedEvent);
        assertEquals("Annual Tech Conference", savedEvent.getName());
        assertEquals("Tech Park Auditorium", savedEvent.getLocation());

        // Verify interaction
        verify(eventRepository, times(1)).save(mockEvent1);
    }

    @Test
    void testDeleteEvent() {
        // Perform delete operation
        eventRepository.delete(mockEvent1);

        // Verify interaction
        verify(eventRepository, times(1)).delete(mockEvent1);
    }
}
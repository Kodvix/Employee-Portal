package com.employee.controllertest;

import com.employee.controller.EventController;
import com.employee.dto.EventDto;
import com.employee.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EventControllerTest {

    @Mock
    private EventService eventService;

    @InjectMocks
    private EventController eventController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllEvents() {
        EventDto event1 = new EventDto();
        event1.setName("Event 1");
        EventDto event2 = new EventDto();
        event2.setName("Event 2");
        List<EventDto> events = Arrays.asList(event1, event2);

        when(eventService.getAllEvents()).thenReturn(events);

        List<EventDto> response = eventController.getAllEvents();

        assertEquals(2, response.size());
        verify(eventService, times(1)).getAllEvents();
    }

    @Test
    void getEventById() {
        EventDto event = new EventDto();
        event.setName("Sample Event");

        when(eventService.getEventById(1L)).thenReturn(event);

        EventDto response = eventController.getEventById(1L);

        assertEquals("Sample Event", response.getName());
        verify(eventService, times(1)).getEventById(1L);
    }

    @Test
    void createEvent() throws IOException {
        MockMultipartFile image = new MockMultipartFile("eventImage", "image.jpg", "image/jpeg", "image content".getBytes());

        EventDto createdEvent = new EventDto();
        createdEvent.setName("New Event");

        when(eventService.createEvent(any(EventDto.class))).thenReturn(createdEvent);

        ResponseEntity<?> response = eventController.createEvent(
                "New Event",
                "Description",
                "2025-05-29",
                "Location",
                image
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof EventDto);
        verify(eventService, times(1)).createEvent(any(EventDto.class));
    }

 

    @Test
    void updateEventWithImage() throws IOException {
        MockMultipartFile image = new MockMultipartFile("eventImage", "image.jpg", "image/jpeg", "image content".getBytes());

        EventDto updatedEvent = new EventDto();
        updatedEvent.setName("Updated Event");

        when(eventService.updateEvent(eq(1L), any(EventDto.class))).thenReturn(updatedEvent);

        ResponseEntity<?> response = eventController.updateEventWithImage(
                1L,
                "Updated Event",
                "Updated Desc",
                "2025-05-30",
                "Updated Location",
                image
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof EventDto);
        verify(eventService, times(1)).updateEvent(eq(1L), any(EventDto.class));
    }

   

   

    @Test
    void deleteEvent() {
        doNothing().when(eventService).deleteEvent(1L);

        eventController.deleteEvent(1L);

        verify(eventService, times(1)).deleteEvent(1L);
    }
}

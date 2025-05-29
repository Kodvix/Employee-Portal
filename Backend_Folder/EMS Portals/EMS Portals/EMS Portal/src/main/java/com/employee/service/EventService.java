package com.employee.service;

import java.util.List;

import com.employee.dto.EventDto;

public interface EventService {
	EventDto createEvent(EventDto event);

	List<EventDto> getAllEvents();

	EventDto getEventById(Long id);

	EventDto updateEvent(Long id, EventDto updatedEvent);
	
	void deleteEvent(Long id);
}

package com.kodvix.ems.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kodvix.ems.dto.EventDto;
import com.kodvix.ems.entity.EventDao;
import com.kodvix.ems.exception.EventNotFoundException;
import com.kodvix.ems.exception.InvalidEventDataException;
import com.kodvix.ems.repository.EventRepository;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<EventDto> getAllEvents() {
        return convertToDtoList(eventRepository.findAll());
    }

    @Override
    public EventDto getEventById(Long id) {
        return convertToDto(eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event with id " + id + " not found")));
    }

    @Override
    public EventDto createEvent(EventDto event) {
        if (event.getName() == null || event.getName().trim().isEmpty()) {
            throw new InvalidEventDataException("Event name cannot be empty");
        }
        return convertToDto(eventRepository.save(convertToDao(event)));
    }

    @Override
    public EventDto updateEvent(Long id, EventDto updatedEvent) {
        return convertToDto(eventRepository.findById(id).map(event -> {
            event.setName(updatedEvent.getName());
            event.setDescription(updatedEvent.getDescription());
            event.setDate(updatedEvent.getDate());
            event.setEventImage(updatedEvent.getEventImage());
            return eventRepository.save(event);
        }).orElseGet(() -> {
            updatedEvent.setId(id);
            return eventRepository.save(convertToDao(updatedEvent));
        }));
    }

    @Override
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    // Helper methods

    private EventDto convertToDto(EventDao event) {
        return modelMapper.map(event, EventDto.class);
    }

    private List<EventDto> convertToDtoList(List<EventDao> eventlist) {
        return eventlist.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private EventDao convertToDao(EventDto eventDto) {
        return modelMapper.map(eventDto, EventDao.class);
    }
}

package com.employee.dtotest;

import org.junit.jupiter.api.Test;

import com.employee.dto.EventDto;

import static org.assertj.core.api.Assertions.assertThat;

public class EventDtoTest {

    @Test
    void testEventDtoGettersAndSetters() {
        EventDto event = new EventDto();

        Long id = 1L;
        String name = "Annual Meetup";
        String description = "A gathering to discuss annual performance and plans";
        String date = "2025-06-10";
        String location = "Conference Hall, Office HQ";
        byte[] eventImage = new byte[] {1, 2, 3, 4, 5};

        event.setId(id);
        event.setName(name);
        event.setDescription(description);
        event.setDate(date);
        event.setLocation(location);
        event.setEventImage(eventImage);

        assertThat(event.getId()).isEqualTo(id);
        assertThat(event.getName()).isEqualTo(name);
        assertThat(event.getDescription()).isEqualTo(description);
        assertThat(event.getDate()).isEqualTo(date);
        assertThat(event.getLocation()).isEqualTo(location);
        assertThat(event.getEventImage()).isEqualTo(eventImage);
    }
}

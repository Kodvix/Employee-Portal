package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.EventDao;

import static org.junit.jupiter.api.Assertions.*;

class EventDaoTest {

    @Test
    void testNoArgsConstructor() {
        EventDao event = new EventDao();
        assertNotNull(event);
    }

    @Test
    void testAllArgsConstructor() {
        byte[] image = new byte[]{1, 2, 3};

        EventDao event = new EventDao(
                1L,
                "Tech Meetup",
                "A gathering of software professionals.",
                "2025-06-15",
                "Mumbai",
                image
        );

        assertAll(
                () -> assertEquals(1L, event.getId()),
                () -> assertEquals("Tech Meetup", event.getName()),
                () -> assertEquals("A gathering of software professionals.", event.getDescription()),
                () -> assertEquals("2025-06-15", event.getDate()),
                () -> assertEquals("Mumbai", event.getLocation()),
                () -> assertArrayEquals(image, event.getEventImage())
        );
    }

    @Test
    void testBuilderPattern() {
        byte[] imgData = new byte[]{9, 8, 7};

        EventDao event = EventDao.builder()
                .id(2L)
                .name("Career Fair")
                .description("Company and candidate interaction")
                .date("2025-07-20")
                .location("Delhi")
                .eventImage(imgData)
                .build();

        assertAll(
                () -> assertEquals(2L, event.getId()),
                () -> assertEquals("Career Fair", event.getName()),
                () -> assertEquals("Company and candidate interaction", event.getDescription()),
                () -> assertEquals("2025-07-20", event.getDate()),
                () -> assertEquals("Delhi", event.getLocation()),
                () -> assertArrayEquals(imgData, event.getEventImage())
        );
    }

    @Test
    void testSettersAndGetters() {
        EventDao event = new EventDao();

        byte[] image = new byte[]{4, 5, 6};
        event.setId(3L);
        event.setName("Hackathon");
        event.setDescription("Coding competition");
        event.setDate("2025-08-01");
        event.setLocation("Bangalore");
        event.setEventImage(image);

        assertAll(
                () -> assertEquals(3L, event.getId()),
                () -> assertEquals("Hackathon", event.getName()),
                () -> assertEquals("Coding competition", event.getDescription()),
                () -> assertEquals("2025-08-01", event.getDate()),
                () -> assertEquals("Bangalore", event.getLocation()),
                () -> assertArrayEquals(image, event.getEventImage())
        );
    }
}

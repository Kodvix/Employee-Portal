package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.AssistRequestDao;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class AssistRequestDaoTest {

    @Test
    void testNoArgsConstructor() {
        AssistRequestDao request = new AssistRequestDao();
        assertNotNull(request);
    }

    @Test
    void testSettersAndGetters() {
        AssistRequestDao request = new AssistRequestDao();
        LocalDate neededBy = LocalDate.of(2025, 7, 1);

        request.setId(1L);
        request.setType("Hardware");
        request.setJustification("Need a new laptop for development.");
        request.setNeededByDate(neededBy);

        assertEquals(1L, request.getId());
        assertEquals("Hardware", request.getType());
        assertEquals("Need a new laptop for development.", request.getJustification());
        assertEquals(neededBy, request.getNeededByDate());
    }

    @Test
    void testAllArgsConstructorViaSetters() {
        AssistRequestDao request = new AssistRequestDao();
        request.setId(2L);
        request.setType("Software");
        request.setJustification("Need IntelliJ Ultimate license.");
        request.setNeededByDate(LocalDate.of(2025, 8, 15));

        assertAll(
                () -> assertEquals(2L, request.getId()),
                () -> assertEquals("Software", request.getType()),
                () -> assertEquals("Need IntelliJ Ultimate license.", request.getJustification()),
                () -> assertEquals(LocalDate.of(2025, 8, 15), request.getNeededByDate())
        );
    }
}

package com.employee.dtotest;

import org.junit.jupiter.api.Test;

import com.employee.dto.Priority;

import static org.junit.jupiter.api.Assertions.*;

class PriorityTest {

    @Test
    void testEnumValues() {
        Priority[] priorities = Priority.values();
        assertEquals(4, priorities.length);
        assertEquals(Priority.LOW, Priority.valueOf("LOW"));
        assertEquals(Priority.MEDIUM, Priority.valueOf("MEDIUM"));
        assertEquals(Priority.HIGH, Priority.valueOf("HIGH"));
        assertEquals(Priority.CRITICAL, Priority.valueOf("CRITICAL"));
    }
}

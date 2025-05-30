package com.employee.dtotest;

import org.junit.jupiter.api.Test;

import com.employee.dto.ProjectStatus;

import static org.junit.jupiter.api.Assertions.*;

public class ProjectStatusTest {

    @Test
    void testEnumValues() {
        ProjectStatus[] statuses = ProjectStatus.values();

        assertEquals(5, statuses.length, "There should be 5 enum constants");

        assertEquals(ProjectStatus.PLANNED, statuses[0]);
        assertEquals(ProjectStatus.IN_PROGRESS, statuses[1]);
        assertEquals(ProjectStatus.COMPLETED, statuses[2]);
        assertEquals(ProjectStatus.ON_HOLD, statuses[3]);
        assertEquals(ProjectStatus.CANCELLED, statuses[4]);
    }

    @Test
    void testValueOf() {
        assertEquals(ProjectStatus.PLANNED, ProjectStatus.valueOf("PLANNED"));
        assertEquals(ProjectStatus.IN_PROGRESS, ProjectStatus.valueOf("IN_PROGRESS"));
        assertEquals(ProjectStatus.COMPLETED, ProjectStatus.valueOf("COMPLETED"));
        assertEquals(ProjectStatus.ON_HOLD, ProjectStatus.valueOf("ON_HOLD"));
        assertEquals(ProjectStatus.CANCELLED, ProjectStatus.valueOf("CANCELLED"));
    }

    @Test
    void testToString() {
        assertEquals("PLANNED", ProjectStatus.PLANNED.toString());
        assertEquals("IN_PROGRESS", ProjectStatus.IN_PROGRESS.toString());
        assertEquals("COMPLETED", ProjectStatus.COMPLETED.toString());
        assertEquals("ON_HOLD", ProjectStatus.ON_HOLD.toString());
        assertEquals("CANCELLED", ProjectStatus.CANCELLED.toString());
    }
}

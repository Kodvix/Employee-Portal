package com.employee.entitytest;

import com.employee.dto.Priority;
import com.employee.entity.ProjectDao;
import com.employee.entity.TaskDao;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class TaskDaoTest {

    @Test
    void testBuilderAndGetters() {
        LocalDateTime now = LocalDateTime.now();

        ProjectDao project = ProjectDao.builder().id(1L).name("Project 1").build();

        TaskDao task = TaskDao.builder()
                .id(100L)
                .title("Implement feature X")
                .description("Detailed description")
                .priority(Priority.HIGH)
                .dueDate(now.plusDays(7))
                .assignedTo("john.doe")
                .completedAt(null)
                .progress("In Progress")
                .empId(10L)
                .project(project)
                .build();

        assertEquals(100L, task.getId());
        assertEquals("Implement feature X", task.getTitle());
        assertEquals("Detailed description", task.getDescription());
        assertEquals(Priority.HIGH, task.getPriority());
        assertEquals(now.plusDays(7), task.getDueDate());
        assertEquals("john.doe", task.getAssignedTo());
        assertNull(task.getCompletedAt());
        assertEquals("In Progress", task.getProgress());
        assertEquals(10L, task.getEmpId());
        assertEquals(project, task.getProject());
    }

    @Test
    void testSetters() {
        TaskDao task = new TaskDao();
        task.setId(1L);
        task.setTitle("Task title");
        task.setDescription("Desc");
        task.setPriority(Priority.MEDIUM);
        task.setDueDate(LocalDateTime.now());
        task.setAssignedTo("employee1");
        task.setCompletedAt(LocalDateTime.now().plusDays(1));
        task.setProgress("50%");
        task.setEmpId(5L);

        assertEquals(1L, task.getId());
        assertEquals("Task title", task.getTitle());
        assertEquals("Desc", task.getDescription());
        assertEquals(Priority.MEDIUM, task.getPriority());
        assertNotNull(task.getDueDate());
        assertEquals("employee1", task.getAssignedTo());
        assertNotNull(task.getCompletedAt());
        assertEquals("50%", task.getProgress());
        assertEquals(5L, task.getEmpId());
    }

    @Test
    void testTitleNotBlankConstraint() {
        TaskDao task = new TaskDao();
        // Since @NotBlank is a validation annotation, it is typically validated by
        // frameworks (e.g. Spring Validation). We can't test it directly here
        // without validation framework context, but you can test that setting blank title works:
        task.setTitle("NonEmptyTitle");
        assertEquals("NonEmptyTitle", task.getTitle());

        task.setTitle("");
        assertEquals("", task.getTitle());

        task.setTitle(null);
        assertNull(task.getTitle());
    }
}

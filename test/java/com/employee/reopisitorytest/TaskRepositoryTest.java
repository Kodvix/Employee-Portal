package com.employee.reopisitorytest;

import com.employee.entity.ProjectDao;
import com.employee.entity.TaskDao;
import com.employee.repository.TaskRepository;
import com.employee.dto.Priority;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskRepositoryTest {

    @Mock
    private TaskRepository taskRepository; // Mocked repository

    private TaskDao mockTask1;
    private TaskDao mockTask2;
    private ProjectDao mockProject;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create mock Project
        mockProject = new ProjectDao();
        mockProject.setId(1L);
        mockProject.setName("New Website Development");

        // Create mock Tasks
        mockTask1 = TaskDao.builder()
                .id(1L)
                .title("Design Homepage")
                .description("Create the homepage layout")
                .priority(Priority.HIGH)
                .dueDate(LocalDateTime.of(2025, 5, 20, 10, 0))
                .assignedTo("John Doe")
                .progress("In Progress")
                .project(mockProject)
                .build();

        mockTask2 = TaskDao.builder()
                .id(2L)
                .title("Develop Backend")
                .description("Implement backend logic for user authentication")
                .priority(Priority.MEDIUM)
                .dueDate(LocalDateTime.of(2025, 6, 10, 15, 0))
                .assignedTo("Jane Smith")
                .completedAt(LocalDateTime.of(2025, 6, 5, 12, 0))
                .progress("Completed")
                .project(mockProject)
                .build();
    }

    @Test
    void testFindByProjectId() {
        // Mock the behavior of findByProjectId
        when(taskRepository.findByProjectId(1L)).thenReturn(Arrays.asList(mockTask1, mockTask2));

        // Call the method
        List<TaskDao> result = taskRepository.findByProjectId(1L);

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Design Homepage", result.get(0).getTitle());
        assertEquals("Develop Backend", result.get(1).getTitle());

        // Verify interaction
        verify(taskRepository, times(1)).findByProjectId(1L);
    }

    @Test
    void testFindById() {
        // Mock the behavior of findById
        when(taskRepository.findById(1L)).thenReturn(Optional.of(mockTask1));

        // Call the method
        Optional<TaskDao> result = taskRepository.findById(1L);

        // Assertions
        assertTrue(result.isPresent());
        assertEquals("Design Homepage", result.get().getTitle());
        assertEquals(Priority.HIGH, result.get().getPriority());

        // Verify interaction
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        // Mock the behavior of findById for a non-existent ID
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        // Call the method
        Optional<TaskDao> result = taskRepository.findById(99L);

        // Assertions
        assertTrue(result.isEmpty());

        // Verify interaction
        verify(taskRepository, times(1)).findById(99L);
    }

    @Test
    void testFindAll() {
        // Mock the behavior of findAll
        when(taskRepository.findAll()).thenReturn(Arrays.asList(mockTask1, mockTask2));

        // Call the method
        List<TaskDao> result = taskRepository.findAll();

        // Assertions
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Design Homepage", result.get(0).getTitle());
        assertEquals("Develop Backend", result.get(1).getTitle());

        // Verify interaction
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void testSaveTask() {
        // Mock the behavior of save
        when(taskRepository.save(mockTask1)).thenReturn(mockTask1);

        // Call the method
        TaskDao savedTask = taskRepository.save(mockTask1);

        // Assertions
        assertNotNull(savedTask);
        assertEquals("Design Homepage", savedTask.getTitle());
        assertEquals(Priority.HIGH, savedTask.getPriority());

        // Verify interaction
        verify(taskRepository, times(1)).save(mockTask1);
    }

    @Test
    void testDeleteTask() {
        // Perform delete operation
        taskRepository.delete(mockTask1);

        // Verify interaction
        verify(taskRepository, times(1)).delete(mockTask1);
    }
}
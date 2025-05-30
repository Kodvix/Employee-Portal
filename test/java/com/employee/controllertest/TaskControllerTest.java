package com.employee.controllertest;

import com.employee.controller.TaskController;
import com.employee.dto.TaskDto;
import com.employee.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTask() {
        TaskDto input = new TaskDto();
        TaskDto output = new TaskDto();
        when(taskService.create(input)).thenReturn(output);

        TaskDto result = taskController.createTask(input);

        assertEquals(output, result);
        verify(taskService).create(input);
    }

    @Test
    void getAllTasks() {
        List<TaskDto> tasks = List.of(new TaskDto(), new TaskDto());
        when(taskService.getAll()).thenReturn(tasks);

        List<TaskDto> result = taskController.getAllTasks();

        assertEquals(tasks, result);
        verify(taskService).getAll();
    }

    @Test
    void getAllTasksByEmp() {
        Long empId = 1L;
        List<TaskDto> tasks = List.of(new TaskDto());
        when(taskService.getAllTaskByEmp(empId)).thenReturn(tasks);

        List<TaskDto> result = taskController.getAllTasksByEmp(empId);

        assertEquals(tasks, result);
        verify(taskService).getAllTaskByEmp(empId);
    }

    @Test
    void getTaskById() {
        Long id = 1L;
        TaskDto task = new TaskDto();
        when(taskService.getById(id)).thenReturn(task);

        TaskDto result = taskController.getTaskById(id);

        assertEquals(task, result);
        verify(taskService).getById(id);
    }

    @Test
    void updateTask() {
        Long id = 1L;
        TaskDto input = new TaskDto();
        TaskDto updated = new TaskDto();
        when(taskService.update(id, input)).thenReturn(updated);

        TaskDto result = taskController.updateTask(id, input);

        assertEquals(updated, result);
        verify(taskService).update(id, input);
    }

    @Test
    void deleteTask() {
        Long id = 1L;
        doNothing().when(taskService).delete(id);

        ResponseEntity<String> response = taskController.deleteTask(id);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Task deleted successfully", response.getBody());
        verify(taskService).delete(id);
    }

    @Test
    void getTasksByEmployeeName() {
        String name = "John";
        List<TaskDto> tasks = List.of(new TaskDto());
        when(taskService.getTasksByEmployeeName(name)).thenReturn(tasks);

        List<TaskDto> result = taskController.getTasksByEmployeeName(name);

        assertEquals(tasks, result);
        verify(taskService).getTasksByEmployeeName(name);
    }
}

package com.employee.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.employee.dto.TaskDto;
import com.employee.service.TaskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Task API")
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Create a new task")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskDto createTask(@RequestBody @Valid TaskDto taskDTO) {
        return taskService.create(taskDTO);
    }

    @Operation(summary = "Retrieve all tasks")
    @GetMapping
    public List<TaskDto> getAllTasks() {
        return taskService.getAll();
    }

    @GetMapping("/employee/{empId}")
    public List<TaskDto> getAllTasksByEmp(@PathVariable Long empId) {
        return taskService.getAllTaskByEmp(empId);
    }

    @Operation(summary = "Get task by its ID")
    @GetMapping("{id}")
    public TaskDto getTaskById(@PathVariable Long id) {
        return taskService.getById(id);
    }

    @Operation(summary = "Update an existing task")
    @PutMapping("/{id}")
    public TaskDto updateTask(@PathVariable Long id, @RequestBody @Valid TaskDto taskDTO) {
        return taskService.update(id, taskDTO);
    }

    @Operation(summary = "Delete a task by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.ok("Task deleted successfully");
    }

    @Operation(summary = "Get tasks by Employee Name")
    @GetMapping("/employee/name/{name}")
    @ResponseStatus(HttpStatus.OK)
    public List<TaskDto> getTasksByEmployeeName(@PathVariable String name) {
        return taskService.getTasksByEmployeeName(name);
    }

}
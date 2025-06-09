package com.kodvix.ems.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kodvix.ems.dto.ProjectDto;
import com.kodvix.ems.service.ProjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project API")
public class ProjectController {

    private final ProjectService projectService;

    @Operation(summary = "Create a new project")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDto createProject(@RequestBody @Valid ProjectDto projectDTO) {
        return projectService.create(projectDTO);
    }

    @Operation(summary = "Get all projects")
    @GetMapping
    public List<ProjectDto> getAllProjects() {
        return projectService.getAll();
    }

    @Operation(summary = "Get project details by ID")
    @GetMapping("/{id}")
    public ProjectDto getProjectById(@PathVariable Long id) {
        return projectService.getById(id);
    }

    @Operation(summary = "Update an existing project by ID")
    @PutMapping("/{id}")
    public ProjectDto updateProject(@PathVariable Long id, @RequestBody @Valid ProjectDto projectDTO) {
        return projectService.update(id, projectDTO);
    }

    @Operation(summary = "Delete a project by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.ok("Project deleted successfully");
    }
}

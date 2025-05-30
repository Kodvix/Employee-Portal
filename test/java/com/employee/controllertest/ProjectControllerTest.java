package com.employee.controllertest;

import com.employee.controller.ProjectController;
import com.employee.dto.ProjectDto;
import com.employee.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ProjectController projectController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createProject() {
        ProjectDto inputDto = new ProjectDto();
        ProjectDto returnedDto = new ProjectDto();
        when(projectService.create(inputDto)).thenReturn(returnedDto);

        ProjectDto result = projectController.createProject(inputDto);

        assertEquals(returnedDto, result);
        verify(projectService).create(inputDto);
    }

    @Test
    void getAllProjects() {
        List<ProjectDto> projects = List.of(new ProjectDto(), new ProjectDto());
        when(projectService.getAll()).thenReturn(projects);

        List<ProjectDto> result = projectController.getAllProjects();

        assertEquals(projects, result);
        verify(projectService).getAll();
    }

    @Test
    void getProjectById() {
        Long id = 1L;
        ProjectDto project = new ProjectDto();
        when(projectService.getById(id)).thenReturn(project);

        ProjectDto result = projectController.getProjectById(id);

        assertEquals(project, result);
        verify(projectService).getById(id);
    }

    @Test
    void updateProject() {
        Long id = 1L;
        ProjectDto inputDto = new ProjectDto();
        ProjectDto updatedDto = new ProjectDto();
        when(projectService.update(id, inputDto)).thenReturn(updatedDto);

        ProjectDto result = projectController.updateProject(id, inputDto);

        assertEquals(updatedDto, result);
        verify(projectService).update(id, inputDto);
    }

    @Test
    void deleteProject() {
        Long id = 1L;
        doNothing().when(projectService).delete(id);

        ResponseEntity<String> response = projectController.deleteProject(id);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Project deleted successfully", response.getBody());
        verify(projectService).delete(id);
    }
}

package com.employee.servicetest;

import com.employee.dto.TaskDto;
import com.employee.entity.ProjectDao;
import com.employee.entity.TaskDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.mapper.TaskMapper;
import com.employee.repository.ProjectRepository;
import com.employee.repository.TaskRepository;
import com.employee.service.TaskServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceImplTest {

    @Mock
    private TaskRepository repo;

    @Mock
    private ProjectRepository projectRepo;

    @InjectMocks
    private TaskServiceImpl service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void create() {
        TaskDto dto = new TaskDto();
        dto.setTitle("Test Task");
        dto.setProjectId(1L);

        ProjectDao project = new ProjectDao();
        project.setId(1L);

        TaskDao task = new TaskDao();
        task.setTitle("Test Task");
        task.setProject(project);

        when(projectRepo.findById(1L)).thenReturn(Optional.of(project));
        when(repo.save(any(TaskDao.class))).thenReturn(task);

        TaskDto result = service.create(dto);

        assertEquals("Test Task", result.getTitle());
    }

    @Test
    void getAllTaskByEmp() {
        ProjectDao project = new ProjectDao();
        project.setId(1L); // Set required ID

        TaskDao task = new TaskDao();
        task.setId(101L);
        task.setTitle("Test Task");
        task.setAssignedTo("John");
        task.setProject(project); // ✅ Set project to avoid NPE

        when(repo.findByEmpId(1L)).thenReturn(List.of(task));

        List<TaskDto> result = service.getAllTaskByEmp(1L);

        assertEquals(1, result.size());
        assertEquals("Test Task", result.get(0).getTitle());
        assertEquals(1L, result.get(0).getProjectId());
    }


    @Test
    void getAll() {
        ProjectDao project = new ProjectDao();
        project.setId(10L); // required to avoid NPE

        TaskDao task = new TaskDao();
        task.setId(1L);
        task.setTitle("Demo Task");
        task.setProject(project); // ✅ Assign project

        when(repo.findAll()).thenReturn(List.of(task));

        List<TaskDto> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("Demo Task", result.get(0).getTitle());
        assertEquals(10L, result.get(0).getProjectId());
    }


    @Test
    void getById() {
        // Create and assign ProjectDao
        ProjectDao project = new ProjectDao();
        project.setId(200L);

        // Create TaskDao with non-null project
        TaskDao task = new TaskDao();
        task.setId(1L);
        task.setTitle("Task Sample");
        task.setProject(project); // ✅ must assign to avoid NullPointerException

        when(repo.findById(1L)).thenReturn(Optional.of(task));

        TaskDto dto = service.getById(1L);

        assertNotNull(dto);
        assertEquals("Task Sample", dto.getTitle());
        assertEquals(200L, dto.getProjectId());
    }


    @Test
    void update() {
        TaskDto dto = new TaskDto();
        dto.setTitle("Updated Task");
        dto.setProjectId(1L);

        TaskDao task = new TaskDao();
        task.setId(1L);

        ProjectDao project = new ProjectDao();
        project.setId(1L);

        when(repo.findById(1L)).thenReturn(Optional.of(task));
        when(projectRepo.findById(1L)).thenReturn(Optional.of(project));
        when(repo.save(any(TaskDao.class))).thenReturn(task);

        TaskDto result = service.update(1L, dto);

        assertEquals("Updated Task", result.getTitle());
    }

    @Test
    void delete() {
        TaskDao task = new TaskDao();
        task.setId(1L);

        when(repo.findById(1L)).thenReturn(Optional.of(task));

        service.delete(1L);

        verify(repo).delete(task);
    }

    @Test
    void getTasksByEmployeeName() {
        ProjectDao project = new ProjectDao();
        project.setId(1L);

        TaskDao task = new TaskDao();
        task.setId(1L);
        task.setTitle("Title");
        task.setAssignedTo("John");
        task.setProject(project); // ✅ This is essential

        when(repo.findByAssignedTo("John")).thenReturn(List.of(task));

        List<TaskDto> tasks = service.getTasksByEmployeeName("John");

        assertEquals(1, tasks.size());
        assertEquals("Title", tasks.get(0).getTitle());
    }

} 

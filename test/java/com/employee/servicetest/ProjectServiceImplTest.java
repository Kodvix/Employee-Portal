package com.employee.servicetest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.employee.dto.ProjectDto;
import com.employee.dto.TaskDto;
import com.employee.entity.CompanyDao;
import com.employee.entity.ProjectDao;
import com.employee.entity.TaskDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.repository.CompanyRepository;
import com.employee.repository.ProjectRepository;
import com.employee.service.ProjectServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.*;

class ProjectServiceImplTest {

    @Mock
    private ProjectRepository repo;

    @Mock
    private CompanyRepository companyRepo;

    @InjectMocks
    private ProjectServiceImpl service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void create() {
        ProjectDto dto = new ProjectDto();
        dto.setCompanyId(1L);
        dto.setName("Test Project");

        CompanyDao company = new CompanyDao();
        company.setId(1L);

        when(companyRepo.findById(1L)).thenReturn(Optional.of(company));
        when(repo.save(any(ProjectDao.class))).thenAnswer(i -> i.getArgument(0));

        ProjectDto result = service.create(dto);

        assertNotNull(result);
        assertEquals("Test Project", result.getName());
        verify(companyRepo).findById(1L);
        verify(repo).save(any());
    }
    @Test
    void getAll() {
        CompanyDao company = new CompanyDao();
        company.setId(1L);

        ProjectDao p1 = new ProjectDao();
        p1.setId(1L);
        p1.setName("P1");
        p1.setCompany(company); // Important

        ProjectDao p2 = new ProjectDao();
        p2.setId(2L);
        p2.setName("P2");
        p2.setCompany(company); // Important

        when(repo.findAll()).thenReturn(List.of(p1, p2));

        List<ProjectDto> list = service.getAll();

        assertEquals(2, list.size());
        assertEquals("P1", list.get(0).getName());
        assertEquals("P2", list.get(1).getName());
        verify(repo).findAll();
    }


    @Test
    void getById() {
        CompanyDao company = new CompanyDao();
        company.setId(1L);

        ProjectDao project = new ProjectDao();
        project.setId(1L);
        project.setName("Test Project");
        project.setCompany(company); // ✅ FIX: set the company to avoid NullPointerException

        when(repo.findById(1L)).thenReturn(Optional.of(project));

        ProjectDto result = service.getById(1L);

        assertEquals("Test Project", result.getName());
        assertEquals(1L, result.getCompanyId());
        verify(repo).findById(1L);
    }


    @Test
    void update() {
        Long id = 1L;
        ProjectDto dto = new ProjectDto();
        dto.setCompanyId(2L);
        dto.setName("Updated");
        dto.setDescription("Desc");
        dto.setStartDate(LocalDate.now());
        dto.setEndDate(LocalDate.now().plusDays(10));
//        dto.setStatus("Active");

        CompanyDao company = new CompanyDao();
        company.setId(2L);

        ProjectDao existing = new ProjectDao();
        existing.setId(id);

        when(repo.findById(id)).thenReturn(Optional.of(existing));
        when(companyRepo.findById(2L)).thenReturn(Optional.of(company));
        when(repo.save(existing)).thenReturn(existing);

        ProjectDto updated = service.update(id, dto);

        assertNotNull(updated);
        assertEquals("Updated", updated.getName());
        verify(repo).findById(id);
        verify(companyRepo).findById(2L);
        verify(repo).save(existing);
    }

    @Test
    void delete() {
        Long id = 1L;
        ProjectDao project = new ProjectDao();
        project.setId(id);

        when(repo.findById(id)).thenReturn(Optional.of(project));

        service.delete(id);

        verify(repo).findById(id);
        verify(repo).delete(project);
    }

    @Test
    void getFullProjectById() {
        CompanyDao company = new CompanyDao();
        company.setId(1L);

        ProjectDao project = new ProjectDao();
        project.setId(1L);
        project.setName("Project A");
        project.setCompany(company);

        TaskDao task = new TaskDao();
        task.setId(1L);
        task.setTitle("Task 1");
        task.setProject(project); // ✅ FIX: set the project to avoid NullPointerException

        project.setTasks(List.of(task));

        when(repo.findById(1L)).thenReturn(Optional.of(project));

        ProjectDto result = service.getFullProjectById(1L);

        assertEquals("Project A", result.getName());
        assertEquals(1, result.getTasks().size());
        assertEquals("Task 1", result.getTasks().get(0).getTitle());

        verify(repo).findById(1L);
    }

}

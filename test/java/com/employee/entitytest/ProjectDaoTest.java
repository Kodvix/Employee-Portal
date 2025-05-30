package com.employee.entitytest;

import com.employee.dto.ProjectStatus;
import com.employee.entity.CompanyDao;
import com.employee.entity.ProjectDao;
import com.employee.entity.TaskDao;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class ProjectDaoTest {

    @Test
    void testNoArgsConstructorAndSettersGetters() {
        ProjectDao project = new ProjectDao();

        CompanyDao company = new CompanyDao();
        company.setId(1L);

        List<TaskDao> tasks = new ArrayList<>();
        tasks.add(new TaskDao());

        project.setId(10L);
        project.setName("Project Alpha");
        project.setDescription("Project description");
        project.setStartDate(LocalDate.of(2025, 1, 1));
        project.setEndDate(LocalDate.of(2025, 12, 31));
        project.setStatus(ProjectStatus.IN_PROGRESS);
        project.setCompany(company);
        project.setTasks(tasks);

        assertEquals(10L, project.getId());
        assertEquals("Project Alpha", project.getName());
        assertEquals("Project description", project.getDescription());
        assertEquals(LocalDate.of(2025, 1, 1), project.getStartDate());
        assertEquals(LocalDate.of(2025, 12, 31), project.getEndDate());
        assertEquals(ProjectStatus.IN_PROGRESS, project.getStatus());
        assertEquals(company, project.getCompany());
        assertEquals(tasks, project.getTasks());
    }

    @Test
    void testAllArgsConstructor() {
        CompanyDao company = new CompanyDao();
        company.setId(2L);

        List<TaskDao> tasks = new ArrayList<>();

        ProjectDao project = new ProjectDao(
                20L,
                "Project Beta",
                "Another description",
                LocalDate.of(2024, 5, 1),
                LocalDate.of(2024, 10, 31),
                ProjectStatus.PLANNED,
                company,
                tasks
        );

        assertEquals(20L, project.getId());
        assertEquals("Project Beta", project.getName());
        assertEquals("Another description", project.getDescription());
        assertEquals(LocalDate.of(2024, 5, 1), project.getStartDate());
        assertEquals(LocalDate.of(2024, 10, 31), project.getEndDate());
        assertEquals(ProjectStatus.PLANNED, project.getStatus());
        assertEquals(company, project.getCompany());
        assertEquals(tasks, project.getTasks());
    }

    @Test
    void testBuilder() {
        CompanyDao company = new CompanyDao();
        company.setId(3L);

        List<TaskDao> tasks = new ArrayList<>();

        ProjectDao project = ProjectDao.builder()
                .id(30L)
                .name("Project Gamma")
                .description("Builder description")
                .startDate(LocalDate.of(2023, 3, 1))
                .endDate(LocalDate.of(2023, 9, 30))
                .status(ProjectStatus.COMPLETED)
                .company(company)
                .tasks(tasks)
                .build();

        assertEquals(30L, project.getId());
        assertEquals("Project Gamma", project.getName());
        assertEquals("Builder description", project.getDescription());
        assertEquals(LocalDate.of(2023, 3, 1), project.getStartDate());
        assertEquals(LocalDate.of(2023, 9, 30), project.getEndDate());
        assertEquals(ProjectStatus.COMPLETED, project.getStatus());
        assertEquals(company, project.getCompany());
        assertEquals(tasks, project.getTasks());
    }
}

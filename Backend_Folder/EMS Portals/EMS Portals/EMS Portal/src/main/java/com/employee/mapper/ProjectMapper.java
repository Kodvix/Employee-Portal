package com.employee.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.employee.dto.ProjectDto;
import com.employee.dto.TaskDto;
import com.employee.entity.ProjectDao;

public class ProjectMapper {

    public static ProjectDao toEntity(ProjectDto dto) {
        ProjectDao project = new ProjectDao();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        return project;
    }

    public static ProjectDto toDTO(ProjectDao project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setCompanyId(project.getCompany().getId());

        // Mapping tasks
        // Add null check for tasks to avoid NullPointerException
        List<TaskDto> taskDTOs = (project.getTasks() != null)
                ? project.getTasks().stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList())
                : new ArrayList<>();  // Return an empty list if tasks is null

        dto.setTasks(taskDTOs);

        return dto;
    }

}

package com.employee.mapper;

import com.employee.dto.TaskDto;
import com.employee.entity.TaskDao;

public class TaskMapper {

    public static TaskDao toEntity(TaskDto dto) {
        TaskDao task = new TaskDao();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setDueDate(dto.getDueDate());
        task.setAssignedTo(dto.getAssignedTo());
        task.setCompletedAt(dto.getCompletedAt());
        task.setProgress(dto.getProgress());
        return task;
    }

    public static TaskDto toDTO(TaskDao task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setAssignedTo(task.getAssignedTo());
        dto.setCompletedAt(task.getCompletedAt());
        dto.setProgress(task.getProgress());
        dto.setProjectId(task.getProject().getId());
        return dto;
    }
}

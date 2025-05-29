package com.employee.service;

import java.util.List;

import com.employee.dto.TaskDto;

public interface TaskService {
	
	TaskDto create(TaskDto dto);
	List<TaskDto> getAllTaskByEmp(Long empId);
	List<TaskDto> getAll();
	TaskDto getById(Long id);
	TaskDto update(Long id, TaskDto dto);
	void delete(Long id);

	List<TaskDto> getTasksByEmployeeName(String name);

}

package com.kodvix.ems.service;

import java.util.List;

import com.kodvix.ems.dto.TaskDto;

public interface TaskService {
	
	TaskDto create(TaskDto dto);
	List<TaskDto> getAllTaskByEmp(Long empId);
	List<TaskDto> getAll();
	TaskDto getById(Long id);
	TaskDto update(Long id, TaskDto dto);
	void delete(Long id);

	List<TaskDto> getTasksByEmployeeName(String name);

}

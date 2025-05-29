package com.employee.service;

import java.util.List;
import java.util.stream.Collectors;

import com.employee.dto.LeaveDto;
import com.employee.entity.EmployeeDao;
import com.employee.entity.LeaveDao;
import com.employee.repository.EmployeeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.employee.dto.TaskDto;
import com.employee.entity.ProjectDao;
import com.employee.entity.TaskDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.mapper.TaskMapper;
import com.employee.repository.ProjectRepository;
import com.employee.repository.TaskRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService{

    private final TaskRepository repo;
    private final ProjectRepository projectRepo;
    private final EmployeeRepository empRepo;
    private final  ModelMapper modelMapper;

    public TaskDto create(TaskDto dto) {
        ProjectDao project = projectRepo.findById(dto.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        EmployeeDao emp = empRepo.findById(dto.getEmpId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
        if(emp == null){
           throw new ResourceNotFoundException("Employee not found");
        }
        return convertToDto(repo.save(convertToDao(dto)));
    }

    public List<TaskDto> getAllTaskByEmp(Long empId){
        return convertToDtoList(repo.findByEmpId(empId));
    }

    public List<TaskDto> getAll() {
        return convertToDtoList(repo.findAll());
    }

    public TaskDto getById(Long id) {
       return convertToDto(repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found")));

    }


    public TaskDto update(Long id, TaskDto dto) {
        TaskDao task = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));

        ProjectDao project = projectRepo.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + dto.getProjectId()));

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setDueDate(dto.getDueDate());
        task.setAssignedTo(dto.getAssignedTo());
        task.setCompletedAt(dto.getCompletedAt());
        task.setProgress(dto.getProgress());
        task.setProject(project);
        return convertToDto(repo.save(task));
    }

    public void delete(Long id) {
        TaskDao task = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));
        repo.delete(task);
    }


    public List<TaskDto> getTasksByEmployeeName(String name) {
        List<TaskDto> tasks = convertToDtoList(repo.findByAssignedTo(name));
        return tasks;
    }

    private TaskDto convertToDto(TaskDao event) {
        return modelMapper.map(event, TaskDto.class);
    }

    private List<TaskDto> convertToDtoList(List<TaskDao> eventlist) {
        return eventlist.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private TaskDao convertToDao(TaskDto eventDto) {
        return modelMapper.map(eventDto, TaskDao.class);
    }


}

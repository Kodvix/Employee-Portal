package com.kodvix.ems.service;

import java.util.List;
import java.util.stream.Collectors;

import com.kodvix.ems.entity.EmployeeDao;
import com.kodvix.ems.repository.EmployeeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kodvix.ems.dto.TaskDto;
import com.kodvix.ems.entity.ProjectDao;
import com.kodvix.ems.entity.TaskDao;
import com.kodvix.ems.exception.ResourceNotFoundException;
import com.kodvix.ems.repository.ProjectRepository;
import com.kodvix.ems.repository.TaskRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService{

    @Autowired
    private TaskRepository repo;
    @Autowired
    private ProjectRepository projectRepo;
    @Autowired
    private EmployeeRepository empRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public TaskDto create(TaskDto dto) {
        ProjectDao project = projectRepo.findById(dto.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found with ID: " + dto.getProjectId()));

        EmployeeDao emp = empRepo.findById(dto.getEmpId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + dto.getEmpId()));
        if(emp == null){
           throw new ResourceNotFoundException("Employee not found");
        }
        return convertToDto(repo.save(convertToDao(dto)));
    }

    @Override
    public List<TaskDto> getAllTaskByEmp(Long empId){
        return convertToDtoList(repo.findByEmpId(empId));
    }

    @Override
    public List<TaskDto> getAll() {
        return convertToDtoList(repo.findAll());
    }

    @Override
    public TaskDto getById(Long id) {
       return convertToDto(repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id)));

    }

    @Override
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

    @Override
    public void delete(Long id) {
        TaskDao task = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));
        repo.delete(task);
    }

    @Override
    public List<TaskDto> getTasksByEmployeeName(String name) {
        List<TaskDto> tasks = convertToDtoList(repo.findByAssignedTo(name));
        return tasks;
    }

    //Helper methods

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
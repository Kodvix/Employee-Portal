package com.employee.service;

import com.employee.dto.ProjectDto;
import com.employee.dto.TaskDto;
import com.employee.entity.CompanyDao;
import com.employee.entity.ProjectDao;
import com.employee.entity.TaskDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.mapper.ProjectMapper;
import com.employee.mapper.TaskMapper;
import com.employee.repository.CompanyRepository;
import com.employee.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository repo;
    private final CompanyRepository companyRepo;
    private final ModelMapper modelMapper;

    @Override
    public ProjectDto create(ProjectDto dto) {
        CompanyDao company = companyRepo.findById(dto.getCompanyId())
                .orElseThrow(() -> new EntityNotFoundException("Company not found"));

        ProjectDao project = ProjectMapper.toEntity(dto);
        project.setCompany(company);

        return convertToDto(repo.save(project));
    }

    @Override
    public List<ProjectDto> getAll() {
        return convertToDtoList(repo.findAll());
    }

    @Override
    public ProjectDto getById(Long id) {
        ProjectDao project = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        return convertToDto(project);
    }

    @Override
    public ProjectDto update(Long id, ProjectDto dto) {
        ProjectDao project = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));

        CompanyDao company = companyRepo.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + dto.getCompanyId()));

        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setStatus(dto.getStatus());
        project.setCompany(company);

        return convertToDto(repo.save(project));
    }

    @Override
    public void delete(Long id) {
        ProjectDao project = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));
        repo.delete(project);
    }

    @Override
    public ProjectDto getFullProjectById(Long id) {
        ProjectDao project = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        List<TaskDto> taskDTOs = project.getTasks().stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());

        ProjectDto projectDTO = ProjectMapper.toDTO(project);
        projectDTO.setTasks(taskDTOs);

        return projectDTO;
    }


    private ProjectDto convertToDto(ProjectDao event) {
        return modelMapper.map(event, ProjectDto.class);
    }

    private List<ProjectDto> convertToDtoList(List<ProjectDao> eventlist) {
        return eventlist.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private ProjectDao convertToDao(ProjectDto eventDto) {
        return modelMapper.map(eventDto, ProjectDao.class);
    }
}

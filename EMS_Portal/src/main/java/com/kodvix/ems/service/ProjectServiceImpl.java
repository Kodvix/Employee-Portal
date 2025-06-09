package com.kodvix.ems.service;

import com.kodvix.ems.dto.ProjectDto;
import com.kodvix.ems.dto.TaskDto;
import com.kodvix.ems.entity.CompanyDao;
import com.kodvix.ems.entity.ProjectDao;
import com.kodvix.ems.exception.ResourceNotFoundException;
import com.kodvix.ems.repository.CompanyRepository;
import com.kodvix.ems.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository repo;
    @Autowired
    private CompanyRepository companyRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ProjectDto create(ProjectDto dto) {
        CompanyDao company = companyRepo.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + dto.getCompanyId()));

        ProjectDao project = convertToDao(dto);
        project.setId(null); // Explicitly mark as new entity
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
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));
        return convertToDto(project);
    }

    @Override
    public ProjectDto update(Long id, ProjectDto dto) {
        ProjectDao existingProject = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));

        CompanyDao company = companyRepo.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + dto.getCompanyId()));

        Long originalId = existingProject.getId(); // Store original ID

        // Map all updatable fields (except ID)
        modelMapper.map(dto, existingProject);

        // Restore original ID to avoid accidental overwrite
        existingProject.setId(originalId);

        // Set relationship explicitly
        existingProject.setCompany(company);

        return convertToDto(repo.save(existingProject));
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
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        ProjectDto projectDTO = convertToDto(project);

        List<TaskDto> taskDTOs = project.getTasks().stream()
                .map(task -> modelMapper.map(task, TaskDto.class))
                .collect(Collectors.toList());

        projectDTO.setTasks(taskDTOs);

        return projectDTO;
    }

    // Helper methods

    private ProjectDto convertToDto(ProjectDao dao) {
        ProjectDto dto = modelMapper.map(dao, ProjectDto.class);
        dto.setCompanyId(dao.getCompany().getId()); // set manually because it's an object
        return dto;
    }

    private List<ProjectDto> convertToDtoList(List<ProjectDao> daoList) {
        return daoList.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private ProjectDao convertToDao(ProjectDto dto) {
        ProjectDao project = modelMapper.map(dto, ProjectDao.class);
        project.setId(null); // Prevent treating this as an update
        return project;
    }

}

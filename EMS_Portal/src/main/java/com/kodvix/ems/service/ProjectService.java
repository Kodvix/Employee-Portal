package com.kodvix.ems.service;

import com.kodvix.ems.dto.ProjectDto;
import java.util.List;

public interface ProjectService {

    ProjectDto create(ProjectDto dto);
    List<ProjectDto> getAll();
    ProjectDto getById(Long id);
    ProjectDto update(Long id, ProjectDto dto);
    void delete(Long id);
    ProjectDto getFullProjectById(Long id);
}

package com.employee.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.employee.dto.CompanyDto;
import com.employee.dto.ProjectDto;
import com.employee.entity.CompanyDao;

public class CompanyMapper {

    public static CompanyDao toEntity(CompanyDto dto) {
        CompanyDao company = new CompanyDao();
        company.setName(dto.getName());
        company.setAddress(dto.getAddress());
        company.setPhoneNumber(dto.getPhoneNumber());
        company.setEmail(dto.getEmail());
        company.setWebsiteUrl(dto.getWebsiteUrl());
        return company;
    }

    public static CompanyDto toDTO(CompanyDao entity) {
        CompanyDto dto = new CompanyDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setAddress(entity.getAddress());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setEmail(entity.getEmail());
        dto.setWebsiteUrl(entity.getWebsiteUrl());

        // Mapping projects
        // Add null check for projects to avoid NullPointerException
        List<ProjectDto> projectDTOs = (entity.getProjects() != null)
                ? entity.getProjects().stream()
                .map(ProjectMapper::toDTO) // Assuming ProjectMapper has toDTO method for projects
                .collect(Collectors.toList())
                : new ArrayList<>();  // Return an empty list if projects is null

        dto.setProjects(projectDTOs);

        return dto;
    }
}

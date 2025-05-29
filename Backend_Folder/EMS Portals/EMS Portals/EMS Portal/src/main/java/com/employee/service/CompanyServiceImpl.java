package com.employee.service;

import com.employee.dto.CompanyDto;
import com.employee.dto.ProjectDto;
import com.employee.dto.TaskDto;
import com.employee.entity.CompanyDao;
import com.employee.entity.TaskDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.mapper.CompanyMapper;
import com.employee.mapper.ProjectMapper;
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
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository repo;
    private final ProjectRepository projectRepository;
    private final ModelMapper modelMapper;

    @Override
    public CompanyDto createCompany(CompanyDto dto) {
        CompanyDao company = CompanyMapper.toEntity(dto);
        return convertToDto(repo.save(company));
    }

    @Override
    public List<CompanyDto> getAllCompanies() {
        return convertToDtoList(repo.findAll());
    }

    @Override
    public CompanyDto getById(Long id) {
        CompanyDao company = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        return convertToDto(company);
    }

    @Override
    public CompanyDto update(Long id, CompanyDto dto) {
        CompanyDao company = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + id));

        company.setName(dto.getName());
        company.setAddress(dto.getAddress());
        company.setPhoneNumber(dto.getPhoneNumber());
        company.setEmail(dto.getEmail());
        company.setWebsiteUrl(dto.getWebsiteUrl());
        return convertToDto(repo.save(company));
    }

    @Override
    public void delete(Long id) {
        CompanyDao company = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + id));
        repo.delete(company);
    }

    @Override
    public CompanyDto getFullCompanyById(Long id) {
        CompanyDao company = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Company not found"));

        List<ProjectDto> projectDTOs = company.getProjects().stream()
                .map(ProjectMapper::toDTO)
                .collect(Collectors.toList());

        CompanyDto companyDTO = CompanyMapper.toDTO(company);
        companyDTO.setProjects(projectDTOs);

        return companyDTO;
    }


    private CompanyDto convertToDto(CompanyDao event) {
        return modelMapper.map(event, CompanyDto.class);
    }

    private List<CompanyDto> convertToDtoList(List<CompanyDao> eventlist) {
        return eventlist.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private CompanyDao convertToDao(CompanyDto eventDto) {
        return modelMapper.map(eventDto, CompanyDao.class);
    }
}

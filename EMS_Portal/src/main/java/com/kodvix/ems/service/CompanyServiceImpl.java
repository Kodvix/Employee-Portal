package com.kodvix.ems.service;

import com.kodvix.ems.dto.CompanyDto;
import com.kodvix.ems.dto.ProjectDto;
import com.kodvix.ems.entity.CompanyDao;
import com.kodvix.ems.entity.ProjectDao;
import com.kodvix.ems.exception.ResourceNotFoundException;
import com.kodvix.ems.repository.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository repo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CompanyDto createCompany(CompanyDto dto) {
        CompanyDao company = convertToDao(dto);
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
        CompanyDao existingCompany = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + id));

        modelMapper.map(dto, existingCompany);
        CompanyDao updatedCompany = repo.save(existingCompany);
        return convertToDto(updatedCompany);
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

        CompanyDto companyDTO = convertToDto(company);

        List<ProjectDto> projectDTOs = company.getProjects().stream()
                .map(this::convertProjectToDto)
                .collect(Collectors.toList());

        companyDTO.setProjects(projectDTOs);
        return companyDTO;
    }

    //Helper methods

    private CompanyDto convertToDto(CompanyDao entity) {
        return modelMapper.map(entity, CompanyDto.class);
    }

    private CompanyDao convertToDao(CompanyDto dto) {
        return modelMapper.map(dto, CompanyDao.class);
    }

    private List<CompanyDto> convertToDtoList(List<CompanyDao> list) {
        return list.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private ProjectDto convertProjectToDto(ProjectDao projectDao) {
        return modelMapper.map(projectDao, ProjectDto.class);
    }
}

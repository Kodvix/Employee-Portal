package com.kodvix.ems.service;

import com.kodvix.ems.dto.CompanyDto;

import java.util.List;

public interface CompanyService {

    CompanyDto createCompany(CompanyDto dto);

    List<CompanyDto> getAllCompanies();

    CompanyDto getById(Long id);

    CompanyDto update(Long id, CompanyDto dto);

    void delete(Long id);

    CompanyDto getFullCompanyById(Long id);
}

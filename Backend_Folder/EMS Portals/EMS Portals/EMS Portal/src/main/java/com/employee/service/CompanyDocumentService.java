package com.employee.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.employee.dto.CompanyDocumentsDto;

public interface CompanyDocumentService {
    CompanyDocumentsDto save(Long empId, MultipartFile offerLetterDoc, MultipartFile latestPaySlipDoc, MultipartFile doc);
    CompanyDocumentsDto update(Long id, Long empId, MultipartFile offerLetterDoc, MultipartFile latestPaySlipDoc, MultipartFile doc);
    void delete(Long id);
    CompanyDocumentsDto getById(Long id);
    List<CompanyDocumentsDto> getAll();
    List<CompanyDocumentsDto> getByEmpId(Long empId);
}

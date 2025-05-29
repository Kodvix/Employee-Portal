package com.employee.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.employee.dto.CompanyDocumentsDto;
import com.employee.entity.CompanyDocumentsDao;
import com.employee.entity.EmployeeDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.mapper.CompanyDocumentsMapper;
import com.employee.repository.CompanyDocumentRepository;
import com.employee.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyDocumentServiceImpl implements CompanyDocumentService {

    private final CompanyDocumentRepository repository;
    private final EmployeeRepository empRepository;

    @Override
    public CompanyDocumentsDto save(Long empId, MultipartFile offerLetterDoc, MultipartFile latestPaySlipDoc, MultipartFile doc) {
        try {
            EmployeeDao emp = empRepository.findById(empId)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee Not Found with ID: " + empId));

            CompanyDocumentsDto cmpDoc = new CompanyDocumentsDto();
            cmpDoc.setEmpId(empId);

            if (offerLetterDoc != null && !offerLetterDoc.isEmpty()) {
                cmpDoc.setOfferLetterDoc(offerLetterDoc.getBytes());
            }

            if (latestPaySlipDoc != null && !latestPaySlipDoc.isEmpty()) {
                cmpDoc.setLatestPaySlipDoc(latestPaySlipDoc.getBytes());
            }

            if (doc != null && !doc.isEmpty()) {
                cmpDoc.setDoc(doc.getBytes());
            }

            CompanyDocumentsDao saved = repository.save(CompanyDocumentsMapper.toDao(cmpDoc));
            return CompanyDocumentsMapper.toDto(saved);
        } catch (IOException e) {
            throw new RuntimeException("Error reading files", e);
        }
    }

    @Override
    public CompanyDocumentsDto update(Long id, Long empId, MultipartFile offerLetterDoc, MultipartFile latestPaySlipDoc, MultipartFile doc) {
        CompanyDocumentsDao existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        try {
            existing.setEmpId(empId);

            if (offerLetterDoc != null && !offerLetterDoc.isEmpty()) {
                existing.setOfferLetterDoc(offerLetterDoc.getBytes());
            }

            if (latestPaySlipDoc != null && !latestPaySlipDoc.isEmpty()) {
                existing.setLatestPaySlipDoc(latestPaySlipDoc.getBytes());
            }

            if (doc != null && !doc.isEmpty()) {
                existing.setDoc(doc.getBytes());
            }

            CompanyDocumentsDao updated = repository.save(existing);
            return CompanyDocumentsMapper.toDto(updated);
        } catch (IOException e) {
            throw new RuntimeException("Error updating files", e);
        }
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Document not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public CompanyDocumentsDto getById(Long id) {
        return CompanyDocumentsMapper.toDto(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id)));
    }

    @Override
    public List<CompanyDocumentsDto> getAll() {
        return CompanyDocumentsMapper.toDtoList(repository.findAll());
    }

    @Override
    public List<CompanyDocumentsDto> getByEmpId(Long empId) {
        return CompanyDocumentsMapper.toDtoList(repository.findByEmpId(empId));
    }
}

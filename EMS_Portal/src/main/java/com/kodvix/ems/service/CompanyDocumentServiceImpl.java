package com.kodvix.ems.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kodvix.ems.dto.CompanyDocumentsDto;
import com.kodvix.ems.entity.CompanyDocumentsDao;
import com.kodvix.ems.entity.EmployeeDao;
import com.kodvix.ems.exception.ResourceNotFoundException;
import com.kodvix.ems.repository.CompanyDocumentRepository;
import com.kodvix.ems.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyDocumentServiceImpl implements CompanyDocumentService {

    @Autowired
    private CompanyDocumentRepository repository;
    @Autowired
    private EmployeeRepository empRepository;
    @Autowired
    private ModelMapper modelMapper;

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

            CompanyDocumentsDao saved = repository.save(convertToDao(cmpDoc));
            return convertToDto(saved);
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
            return convertToDto(updated);
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
        return convertToDto(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id)));
    }

    @Override
    public List<CompanyDocumentsDto> getAll() {
        return convertToDtoList(repository.findAll());
    }

    @Override
    public List<CompanyDocumentsDto> getByEmpId(Long empId) {
        return convertToDtoList(repository.findByEmpId(empId));
    }

    // Helper methods

    private CompanyDocumentsDto convertToDto(CompanyDocumentsDao dao) {
        return modelMapper.map(dao, CompanyDocumentsDto.class);
    }

    private CompanyDocumentsDao convertToDao(CompanyDocumentsDto dto) {
        return modelMapper.map(dto, CompanyDocumentsDao.class);
    }

    private List<CompanyDocumentsDto> convertToDtoList(List<CompanyDocumentsDao> daoList) {
        return daoList.stream().map(this::convertToDto).collect(Collectors.toList());
    }
}

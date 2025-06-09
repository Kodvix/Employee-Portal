package com.kodvix.ems.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.kodvix.ems.exception.ResourceNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kodvix.ems.dto.DocumentDto;
import com.kodvix.ems.entity.DocumentDao;
import com.kodvix.ems.entity.EmployeeDao;
import com.kodvix.ems.repository.DocumentRepository;
import com.kodvix.ems.repository.EmployeeRepository;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public DocumentDto uploadDocument(Long employeeId, MultipartFile file) {
        EmployeeDao employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        try {
            DocumentDao document = new DocumentDao();
            document.setFileName(file.getOriginalFilename());
            document.setFileType(file.getContentType());
            document.setData(file.getBytes());
            document.setUploadTime(LocalDateTime.now());
            document.setEmployee(employee);

            return convertToDto(documentRepository.save(document));
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public List<DocumentDto> getDocumentsByEmployeeId(Long employeeId) {
        return documentRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentDto> getAllDocuments() {
        List<DocumentDao> documentEntities = documentRepository.findAll();
        return documentEntities.stream()
                .map(document -> modelMapper.map(document, DocumentDto.class))
                .toList();
    }

    @Override
    public DocumentDto getDocument(Long documentId) {
        DocumentDao document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        return convertToDto(document);
    }

    @Override
    public DocumentDto updateDocument(Long id, MultipartFile file) {
        DocumentDao existingDocument = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        try {
            existingDocument.setFileName(file.getOriginalFilename());
            existingDocument.setFileType(file.getContentType());
            existingDocument.setData(file.getBytes());
            existingDocument.setUploadTime(LocalDateTime.now());

            return convertToDto(documentRepository.save(existingDocument));
        } catch (Exception e) {
            throw new RuntimeException("Failed to update file", e);
        }
    }

    @Override
    public void deleteDocument(Long id) {
        DocumentDao document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));
        documentRepository.delete(document);
    }

    @Override
    public DocumentDto updateDocumentByEmployee(Long employeeId, Long documentId, MultipartFile file) {
        DocumentDao document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + documentId));

        if (!document.getEmployee().getId().equals(employeeId)) {
            throw new ResourceNotFoundException("Document does not belong to employee with ID: " + employeeId);
        }

        try {
            document.setFileName(file.getOriginalFilename());
            document.setFileType(file.getContentType());
            document.setData(file.getBytes());
            document.setUploadTime(LocalDateTime.now());

            return convertToDto(documentRepository.save(document));
        } catch (Exception e) {
            throw new RuntimeException("Failed to update document", e);
        }
    }

    @Override
    public boolean deleteDocumentByEmployee(Long employeeId, Long documentId) {
        DocumentDao document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + documentId));

        if (!document.getEmployee().getId().equals(employeeId)) {
            throw new ResourceNotFoundException("Document does not belong to employee with ID: " + employeeId);
        }

        documentRepository.delete(document);
        return true;
    }

    // Helper methods

    private DocumentDto convertToDto(DocumentDao entity) {
        return modelMapper.map(entity, DocumentDto.class);
    }

    private DocumentDao convertToDao(DocumentDto dto) {
        return modelMapper.map(dto, DocumentDao.class);
    }
}

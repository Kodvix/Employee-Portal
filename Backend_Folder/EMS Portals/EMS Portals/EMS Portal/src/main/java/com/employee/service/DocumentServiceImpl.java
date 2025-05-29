package com.employee.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.employee.dto.DocumentDto;
import com.employee.entity.DocumentDao;
import com.employee.entity.EmployeeDao;
import com.employee.mapper.DocumentMapper;
import com.employee.repository.DocumentRepository;
import com.employee.repository.EmployeeRepository;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public DocumentDto uploadDocument(Long employeeId, MultipartFile file) {
        EmployeeDao employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));

        try {
            DocumentDao document = DocumentDao.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .data(file.getBytes())
                    .uploadTime(LocalDateTime.now())
                    .employee(employee)
                    .build();
            document = documentRepository.save(document);
            return DocumentMapper.toDto(document);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public List<DocumentDto> getDocumentsByEmployeeId(Long employeeId) {
        List<DocumentDao> documents = documentRepository.findByEmployeeId(employeeId);
        return DocumentMapper.toDtoList(documents);
    }

    @Override
    public DocumentDto getDocument(Long documentId) {
        DocumentDao document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return DocumentMapper.toDto(document);
    }

    @Override
    public DocumentDto updateDocument(Long id, MultipartFile file) {
        DocumentDao existingDocument = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + id));
        try {
            existingDocument.setFileName(file.getOriginalFilename());
            existingDocument.setFileType(file.getContentType());
            existingDocument.setData(file.getBytes());
            existingDocument.setUploadTime(LocalDateTime.now());

            DocumentDao updatedDocument = documentRepository.save(existingDocument);
            return DocumentMapper.toDto(updatedDocument);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update file", e);
        }
    }

    @Override
    public void deleteDocument(Long id) {
        DocumentDao document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + id));
        documentRepository.delete(document);
    }

    @Override
    public DocumentDto updateDocumentByEmployee(Long employeeId, Long documentId, MultipartFile file) {
        DocumentDao document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + documentId));

        if (!document.getEmployee().getId().equals(employeeId)) {
            throw new RuntimeException("Document does not belong to employee with ID: " + employeeId);
        }

        try {
            document.setFileName(file.getOriginalFilename());
            document.setFileType(file.getContentType());
            document.setData(file.getBytes());
            document.setUploadTime(LocalDateTime.now());

            DocumentDao updatedDocument = documentRepository.save(document);
            return DocumentMapper.toDto(updatedDocument);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update document", e);
        }
    }

    @Override
    public boolean deleteDocumentByEmployee(Long employeeId, Long documentId) {
        DocumentDao document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + documentId));

        if (!document.getEmployee().getId().equals(employeeId)) {
            throw new RuntimeException("Document does not belong to employee with ID: " + employeeId);
        }

        documentRepository.delete(document);
        return true;
    }
}

package com.kodvix.ems.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.kodvix.ems.dto.DocumentDto;

public interface DocumentService {
    DocumentDto uploadDocument(Long employeeId, MultipartFile file);
    List<DocumentDto> getDocumentsByEmployeeId(Long employeeId);
    List<DocumentDto> getAllDocuments();
    DocumentDto getDocument(Long documentId);
    DocumentDto updateDocument(Long id, MultipartFile file);
    void deleteDocument(Long id);
    DocumentDto updateDocumentByEmployee(Long employeeId, Long documentId, MultipartFile file);
    boolean deleteDocumentByEmployee(Long employeeId, Long documentId);
}

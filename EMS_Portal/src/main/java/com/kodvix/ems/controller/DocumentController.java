package com.kodvix.ems.controller;

import java.util.List;

import com.kodvix.ems.dto.DocumentDto;
import com.kodvix.ems.service.DocumentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
@Tag(name = "Document API")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Operation(summary = "Upload a document for a specific employee")
    @PostMapping(value = "/upload/{employeeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDocument(@PathVariable Long employeeId,
                                            @RequestParam("file") MultipartFile file) {
        try {
            DocumentDto document = documentService.uploadDocument(employeeId, file);
            return ResponseEntity.ok().body("Document uploaded successfully: " + document.getFileName());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to upload document: " + e.getMessage());
        }
    }

    @Operation(summary = "Retrieve all documents")
    @GetMapping
    public ResponseEntity<List<DocumentDto>> getAllDocuments() {
        List<DocumentDto> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }


    @Operation(summary = "Retrieve all documents for a specific employee")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<DocumentDto>> getDocumentsByEmployee(@PathVariable Long employeeId) {
        List<DocumentDto> documents = documentService.getDocumentsByEmployeeId(employeeId);
        return ResponseEntity.ok(documents);
    }

    @Operation(summary = "Retrieve a document by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<DocumentDto> getDocument(@PathVariable Long id) {
        DocumentDto document = documentService.getDocument(id);
        return ResponseEntity.ok(document);
    }

    @Operation(summary = "Update an existing document by ID")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateDocument(@PathVariable Long id,
                                            @RequestParam("file") MultipartFile file) {
        try {
            DocumentDto updatedDocument = documentService.updateDocument(id, file);
            return ResponseEntity.ok().body("Document updated successfully: " + updatedDocument.getFileName());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to update document: " + e.getMessage());
        }
    }

    @Operation(summary = "Delete a document by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        try {
            documentService.deleteDocument(id);
            return ResponseEntity.ok().body("Document deleted successfully with ID: " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to delete document: " + e.getMessage());
        }
    }

    @Operation(summary = "Update a document for a specific employee by document ID")
    @PutMapping(value = "/employee/{employeeId}/document/{documentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateDocumentByEmployee(
            @PathVariable Long employeeId,
            @PathVariable Long documentId,
            @RequestParam("file") MultipartFile file) {
        try {
            DocumentDto updatedDocument = documentService.updateDocumentByEmployee(employeeId, documentId, file);
            return ResponseEntity.ok().body("Document updated for employee ID " + employeeId +
                    " with new file: " + updatedDocument.getFileName());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error updating document: " + e.getMessage());
        }
    }

    @Operation(summary = "Delete a document for a specific employee by document ID")
    @DeleteMapping("/employee/{employeeId}/document/{documentId}")
    public ResponseEntity<?> deleteDocumentByEmployee(
            @PathVariable Long employeeId,
            @PathVariable Long documentId) {
        try {
            documentService.deleteDocumentByEmployee(employeeId, documentId);
            return ResponseEntity.ok().body("Document Deleted Successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error deleting document: " + e.getMessage());
        }
    }
}

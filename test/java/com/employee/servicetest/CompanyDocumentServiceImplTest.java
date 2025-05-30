package com.employee.servicetest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import com.employee.dto.CompanyDocumentsDto;
import com.employee.entity.CompanyDocumentsDao;
import com.employee.entity.EmployeeDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.repository.CompanyDocumentRepository;
import com.employee.repository.EmployeeRepository;
import com.employee.service.CompanyDocumentServiceImpl;

class CompanyDocumentServiceImplTest {

    @Mock
    private CompanyDocumentRepository repository;

    @Mock
    private EmployeeRepository empRepository;

    @InjectMocks
    private CompanyDocumentServiceImpl service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void save() throws IOException {
        Long empId = 1L;
        EmployeeDao employee = new EmployeeDao();
        employee.setId(empId);

        MultipartFile offerLetter = new MockMultipartFile("offerLetterDoc", "offer.txt", "text/plain", "offer".getBytes());
        MultipartFile paySlip = new MockMultipartFile("latestPaySlipDoc", "payslip.txt", "text/plain", "payslip".getBytes());
        MultipartFile doc = new MockMultipartFile("doc", "doc.txt", "text/plain", "doc".getBytes());

        when(empRepository.findById(empId)).thenReturn(Optional.of(employee));

        CompanyDocumentsDao savedDao = new CompanyDocumentsDao();
        savedDao.setId(100L);
        savedDao.setEmpId(empId);
        savedDao.setOfferLetterDoc(offerLetter.getBytes());
        savedDao.setLatestPaySlipDoc(paySlip.getBytes());
        savedDao.setDoc(doc.getBytes());

        when(repository.save(any(CompanyDocumentsDao.class))).thenReturn(savedDao);

        CompanyDocumentsDto result = service.save(empId, offerLetter, paySlip, doc);

        assertNotNull(result);
        assertEquals(empId, result.getEmpId());
        verify(empRepository).findById(empId);
        verify(repository).save(any(CompanyDocumentsDao.class));
    }

   

    @Test
    void update() throws IOException {
        Long id = 10L;
        Long empId = 1L;

        CompanyDocumentsDao existingDao = new CompanyDocumentsDao();
        existingDao.setId(id);
        existingDao.setEmpId(empId);

        MultipartFile offerLetter = new MockMultipartFile("offerLetterDoc", "offer.txt", "text/plain", "offer".getBytes());
        MultipartFile paySlip = new MockMultipartFile("latestPaySlipDoc", "payslip.txt", "text/plain", "payslip".getBytes());
        MultipartFile doc = new MockMultipartFile("doc", "doc.txt", "text/plain", "doc".getBytes());

        when(repository.findById(id)).thenReturn(Optional.of(existingDao));
        when(repository.save(existingDao)).thenReturn(existingDao);

        CompanyDocumentsDto result = service.update(id, empId, offerLetter, paySlip, doc);

        assertNotNull(result);
        assertEquals(empId, result.getEmpId());
        verify(repository).findById(id);
        verify(repository).save(existingDao);
    }

   

    @Test
    void delete() {
        Long id = 10L;
        when(repository.existsById(id)).thenReturn(true);

        service.delete(id);

        verify(repository).existsById(id);
        verify(repository).deleteById(id);
    }

   

    @Test
    void getById() {
        Long id = 10L;

        CompanyDocumentsDao dao = new CompanyDocumentsDao();
        dao.setId(id);

        when(repository.findById(id)).thenReturn(Optional.of(dao));

        CompanyDocumentsDto result = service.getById(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
        verify(repository).findById(id);
    }

  
    @Test
    void getAll() {
        CompanyDocumentsDao dao1 = new CompanyDocumentsDao();
        dao1.setId(1L);

        CompanyDocumentsDao dao2 = new CompanyDocumentsDao();
        dao2.setId(2L);

        when(repository.findAll()).thenReturn(List.of(dao1, dao2));

        List<CompanyDocumentsDto> result = service.getAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(repository).findAll();
    }

    @Test
    void getByEmpId() {
        Long empId = 1L;
        CompanyDocumentsDao dao1 = new CompanyDocumentsDao();
        dao1.setEmpId(empId);

        CompanyDocumentsDao dao2 = new CompanyDocumentsDao();
        dao2.setEmpId(empId);

        when(repository.findByEmpId(empId)).thenReturn(List.of(dao1, dao2));

        List<CompanyDocumentsDto> result = service.getByEmpId(empId);

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(repository).findByEmpId(empId);
    }
}

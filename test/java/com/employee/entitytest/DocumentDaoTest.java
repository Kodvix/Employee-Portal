package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.DocumentDao;
import com.employee.entity.EmployeeDao;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class DocumentDaoTest {

    @Test
    void testNoArgsConstructor() {
        DocumentDao document = new DocumentDao();
        assertNotNull(document);
    }

    @Test
    void testAllArgsConstructor() {
        byte[] data = "Sample file content".getBytes();
        LocalDateTime now = LocalDateTime.now();
        EmployeeDao employee = EmployeeDao.builder().id(1L).build();

        DocumentDao doc = new DocumentDao(
                10L,
                "file.txt",
                "text/plain",
                data,
                now,
                employee
        );

        assertAll(
                () -> assertEquals(10L, doc.getId()),
                () -> assertEquals("file.txt", doc.getFileName()),
                () -> assertEquals("text/plain", doc.getFileType()),
                () -> assertArrayEquals(data, doc.getData()),
                () -> assertEquals(now, doc.getUploadTime()),
                () -> assertEquals(employee, doc.getEmployee())
        );
    }

    @Test
    void testSettersAndGetters() {
        DocumentDao doc = new DocumentDao();
        byte[] data = {1, 2, 3};
        LocalDateTime timestamp = LocalDateTime.now();
        EmployeeDao employee = EmployeeDao.builder().id(2L).build();

        doc.setId(5L);
        doc.setFileName("resume.pdf");
        doc.setFileType("application/pdf");
        doc.setData(data);
        doc.setUploadTime(timestamp);
        doc.setEmployee(employee);

        assertAll(
                () -> assertEquals(5L, doc.getId()),
                () -> assertEquals("resume.pdf", doc.getFileName()),
                () -> assertEquals("application/pdf", doc.getFileType()),
                () -> assertArrayEquals(data, doc.getData()),
                () -> assertEquals(timestamp, doc.getUploadTime()),
                () -> assertEquals(employee, doc.getEmployee())
        );
    }
}

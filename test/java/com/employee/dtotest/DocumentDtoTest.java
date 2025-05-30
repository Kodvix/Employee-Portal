package com.employee.dtotest;

import org.junit.jupiter.api.Test;

import com.employee.dto.DocumentDto;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

public class DocumentDtoTest {

    @Test
    void testDocumentDtoGettersAndSetters() {
        DocumentDto dto = new DocumentDto();

        Long id = 1L;
        String name = "Resume";
        String type = "application/pdf";
        byte[] data = new byte[]{1, 2, 3};
        LocalDateTime uploadDate = LocalDateTime.of(2025, 5, 20, 14, 30, 0);
        Long employeeId = 10L;

        dto.setId(id);
        dto.setName(name);
        dto.setType(type);
        dto.setData(data);
        dto.setUploadDate(uploadDate);
        dto.setEmployeeId(employeeId);

        assertThat(dto.getId()).isEqualTo(id);
        assertThat(dto.getName()).isEqualTo(name);
        assertThat(dto.getType()).isEqualTo(type);
        assertThat(dto.getData()).isEqualTo(data);
        assertThat(dto.getUploadDate()).isEqualTo(uploadDate);
        assertThat(dto.getEmployeeId()).isEqualTo(employeeId);
    }
}

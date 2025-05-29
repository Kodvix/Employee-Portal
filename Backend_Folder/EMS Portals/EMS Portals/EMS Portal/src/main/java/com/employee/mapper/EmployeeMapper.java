package com.employee.mapper;

import com.employee.dto.EmployeeDto;
import com.employee.dto.DocumentDto;
import com.employee.dto.AddressDto;
import com.employee.entity.EmployeeDao;
import com.employee.entity.DocumentDao;
import com.employee.entity.AddressDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EmployeeMapper {

    private final AddressMapper addressMapper;

    public EmployeeDao toEntity(EmployeeDto dto) {
        if (dto == null) return null;

        EmployeeDao dao = new EmployeeDao();
        dao.setId(dto.getId());
        dao.setFirstName(dto.getFirstName());
        dao.setLastName(dto.getLastName());
        dao.setEmail(dto.getEmail());
        dao.setPhone(dto.getPhone());
        dao.setDepartment(dto.getDepartment());
        dao.setJobTitle(dto.getJobTitle());
        dao.setSalary(dto.getSalary());
        dao.setHireDate(dto.getHireDate());
        dao.setStatus(dto.getStatus());
        dao.setCreatedAt(dto.getCreatedAt());
        dao.setUpdatedAt(dto.getUpdatedAt());

        if (dto.getDocuments() != null) {
            List<DocumentDao> documentDaos = dto.getDocuments().stream()
                    .map(this::toDocumentEntity)
                    .collect(Collectors.toList());
            dao.setDocuments(documentDaos);
        }

        if (dto.getAddress() != null) {
            AddressDao addressDao = addressMapper.toEntity(dto.getAddress(), dao);
            dao.setAddress(addressDao);
        }

        return dao;
    }

    public EmployeeDto toDto(EmployeeDao dao) {
        if (dao == null) return null;

        EmployeeDto dto = new EmployeeDto();
        dto.setId(dao.getId());
        dto.setFirstName(dao.getFirstName());
        dto.setLastName(dao.getLastName());
        dto.setEmail(dao.getEmail());
        dto.setPhone(dao.getPhone());
        dto.setDepartment(dao.getDepartment());
        dto.setJobTitle(dao.getJobTitle());
        dto.setSalary(dao.getSalary());
        dto.setHireDate(dao.getHireDate());
        dto.setStatus(dao.getStatus());
        dto.setCreatedAt(dao.getCreatedAt());
        dto.setUpdatedAt(dao.getUpdatedAt());

        if (dao.getDocuments() != null) {
            List<DocumentDto> documentDtos = dao.getDocuments().stream()
                    .map(this::toDocumentDto)
                    .collect(Collectors.toList());
            dto.setDocuments(documentDtos);
        }

        if (dao.getAddress() != null) {
            dto.setAddress(addressMapper.toDto(dao.getAddress()));
        }

        return dto;
    }

    private DocumentDto toDocumentDto(DocumentDao dao) {
        if (dao == null) return null;

        DocumentDto dto = new DocumentDto();
        dto.setId(dao.getId());
        dto.setName(dao.getFileName());
        dto.setType(dao.getFileType());
        dto.setData(dao.getData());
        dto.setUploadDate(dao.getUploadTime());
        dto.setEmployeeId(dao.getEmployee().getId());

        return dto;
    }

    private DocumentDao toDocumentEntity(DocumentDto dto) {
        if (dto == null) return null;

        DocumentDao dao = new DocumentDao();
        dao.setId(dto.getId());
        dao.setFileName(dto.getName());
        dao.setFileType(dto.getType());
        dao.setData(dto.getData());
        dao.setUploadTime(dto.getUploadDate());

        return dao;
    }
}

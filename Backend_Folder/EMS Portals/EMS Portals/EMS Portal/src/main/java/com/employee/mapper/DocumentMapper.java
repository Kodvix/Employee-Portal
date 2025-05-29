package com.employee.mapper;

import com.employee.dto.DocumentDto;
import com.employee.entity.DocumentDao;

import java.util.List;
import java.util.stream.Collectors;

public class DocumentMapper {

    public static DocumentDto toDto(DocumentDao dao) {
        if (dao == null) {
            return null;
        }
        DocumentDto dto = new DocumentDto();
        dto.setId(dao.getId());
        dto.setName(dao.getFileName());
        dto.setType(dao.getFileType());
        dto.setData(dao.getData());
        dto.setUploadDate(dao.getUploadTime());
        dto.setEmployeeId(dao.getEmployee().getId());
        return dto;
    }

    public static DocumentDao toDao(DocumentDto dto) {
        if (dto == null) {
            return null;
        }
        DocumentDao dao = new DocumentDao();
        dao.setId(dto.getId());
        dao.setFileName(dto.getName());
        dao.setFileType(dto.getType());
        dao.setData(dto.getData());
        dao.setUploadTime(dto.getUploadDate());
        return dao;
    }

    public static List<DocumentDto> toDtoList(List<DocumentDao> daoList) {
        if (daoList == null) {
            return null;
        }
        return daoList.stream()
                .map(DocumentMapper::toDto)
                .collect(Collectors.toList());
    }

    public static List<DocumentDao> toDaoList(List<DocumentDto> dtoList) {
        if (dtoList == null) {
            return null;
        }
        return dtoList.stream()
                .map(DocumentMapper::toDao)
                .collect(Collectors.toList());
    }
}

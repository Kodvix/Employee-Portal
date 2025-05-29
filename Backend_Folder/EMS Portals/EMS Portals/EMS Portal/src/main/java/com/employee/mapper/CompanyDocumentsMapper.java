package com.employee.mapper;

import com.employee.dto.CompanyDocumentsDto;
import com.employee.entity.CompanyDocumentsDao;

import java.util.List;
import java.util.stream.Collectors;

public class CompanyDocumentsMapper {

    public static CompanyDocumentsDto toDto(CompanyDocumentsDao dao) {
        if (dao == null) {
            return null;
        }
        CompanyDocumentsDto dto = new CompanyDocumentsDto();
        dto.setId(dao.getId());
        dto.setEmpId(dao.getEmpId());
        dto.setOfferLetterDoc(dao.getOfferLetterDoc());
        dto.setLatestPaySlipDoc(dao.getLatestPaySlipDoc());
        dto.setDoc(dao.getDoc());
        return dto;
    }

    public static CompanyDocumentsDao toDao(CompanyDocumentsDto dto) {
        if (dto == null) {
            return null;
        }
        CompanyDocumentsDao dao = new CompanyDocumentsDao();
        dao.setId(dto.getId());
        dao.setEmpId(dto.getEmpId());
        dao.setOfferLetterDoc(dto.getOfferLetterDoc());
        dao.setLatestPaySlipDoc(dto.getLatestPaySlipDoc());
        dao.setDoc(dto.getDoc());
        return dao;
    }

    public static List<CompanyDocumentsDto> toDtoList(List<CompanyDocumentsDao> daoList) {
        if (daoList == null) {
            return null;
        }
        return daoList.stream()
                .map(CompanyDocumentsMapper::toDto)
                .collect(Collectors.toList());
    }

    public static List<CompanyDocumentsDao> toDaoList(List<CompanyDocumentsDto> dtoList) {
        if (dtoList == null) {
            return null;
        }
        return dtoList.stream()
                .map(CompanyDocumentsMapper::toDao)
                .collect(Collectors.toList());
    }
}

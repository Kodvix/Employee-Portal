package com.employee.mapper;

import com.employee.dto.AssistRequestDto;
import com.employee.entity.AssistRequestDao;

public class AssistRequestMapper {

    public static AssistRequestDao toEntity(AssistRequestDto dto) {
        AssistRequestDao assistRequestDao = new AssistRequestDao();
        assistRequestDao.setId(dto.getId()); // Assuming you want to map the id
        assistRequestDao.setType(dto.getType());
        assistRequestDao.setJustification(dto.getJustification());
        assistRequestDao.setNeededByDate(dto.getNeededByDate());
        return assistRequestDao;
    }

    public static AssistRequestDto toDto(AssistRequestDao entity) {
        AssistRequestDto dto = new AssistRequestDto();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setJustification(entity.getJustification());
        dto.setNeededByDate(entity.getNeededByDate());
        return dto;
    }
}

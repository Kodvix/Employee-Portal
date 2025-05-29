package com.employee.mapper;

import com.employee.dto.AttendanceDto;
import com.employee.entity.AttendanceDao;
import com.employee.entity.EmployeeDao;

public class AttendanceMapper {

    public static AttendanceDao toEntity(AttendanceDto dto, EmployeeDao employee) {
        return AttendanceDao.builder()
                .id(dto.getId())
                .date(dto.getDate())
                .checkIn(dto.getCheckIn())
                .checkOut(dto.getCheckOut())
                .status(dto.isStatus())
                .remark(dto.getRemark())
                .employee(employee)
                .build();
    }

    public static AttendanceDto toDto(AttendanceDao entity) {
        AttendanceDto dto = new AttendanceDto();
        dto.setId(entity.getId());
        dto.setDate(entity.getDate());
        dto.setCheckIn(entity.getCheckIn());
        dto.setCheckOut(entity.getCheckOut());
        dto.setStatus(entity.isStatus());
        dto.setRemark(entity.getRemark());
        dto.setEmployeeId(entity.getEmployee().getId());
        return dto;
    }
}

package com.employee.mapper;

import com.employee.dto.LeaveDto;
import com.employee.entity.EmployeeDao;
import com.employee.entity.LeaveDao;

public class LeaveMapper {

    public static LeaveDto toDto(LeaveDao leaveDao) {
        LeaveDto dto = new LeaveDto();
        dto.setId(leaveDao.getId());
        dto.setEmployeeId(leaveDao.getEmployee().getId());
        dto.setLeaveType(leaveDao.getLeaveType());
        dto.setStartDate(leaveDao.getStartDate());
        dto.setEndDate(leaveDao.getEndDate());
        dto.setReason(leaveDao.getReason());
        dto.setStatus(leaveDao.getStatus());
        dto.setLeaveDoc(leaveDao.getLeaveDoc());
        return dto;
    }

    public static LeaveDao toEntity(LeaveDto dto, EmployeeDao employee) {
        return LeaveDao.builder()
                .id(dto.getId())
                .employee(employee)
                .leaveType(dto.getLeaveType())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .reason(dto.getReason())
                .status(dto.getStatus())
                .leaveDoc(dto.getLeaveDoc())
                .build();
    }
    


}

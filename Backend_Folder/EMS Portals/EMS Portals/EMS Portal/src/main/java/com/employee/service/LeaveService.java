package com.employee.service;

import com.employee.dto.LeaveDto;

import java.util.List;
import java.util.Optional;

public interface LeaveService {
    LeaveDto applyLeave(Long employeeId, LeaveDto leaveDto);
    List<LeaveDto> getLeavesByEmployee(Long employeeId);
    List<LeaveDto> getAllLeaves();
    Optional<LeaveDto> getLeaveById(Long leaveId);
    void deleteLeave(Long leaveId);
    LeaveDto updateLeave(LeaveDto leaveDto);
}

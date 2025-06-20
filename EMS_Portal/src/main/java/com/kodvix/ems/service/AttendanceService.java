package com.kodvix.ems.service;

import com.kodvix.ems.dto.AttendanceDto;
import com.kodvix.ems.dto.PunchDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceService {
    AttendanceDto markAttendance(AttendanceDto attendance);
    List<AttendanceDto> getAllAttendance();
    Optional<AttendanceDto> getAttendanceById(Long id);
    Optional<AttendanceDto> updateAttendance(Long id, AttendanceDto dto);
    boolean deleteAttendance(Long id);
    List<AttendanceDto> getAttendanceByEmployeeId(Long employeeId);
    List<AttendanceDto> getAttendanceByEmployeeIdAndDate(Long employeeId, LocalDate date);
    AttendanceDto punchIn(PunchDto dto);
    AttendanceDto punchOut(PunchDto dto);
}

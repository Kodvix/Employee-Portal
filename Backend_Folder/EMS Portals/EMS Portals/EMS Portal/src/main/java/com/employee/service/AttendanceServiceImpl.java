package com.employee.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.employee.dto.AttendanceDto;
import com.employee.dto.PunchDto;
import com.employee.mapper.AttendanceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.entity.AttendanceDao;
import com.employee.entity.EmployeeDao;
import com.employee.repository.AttendanceRepository;
import com.employee.repository.EmployeeRepository;
@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public AttendanceDto markAttendance(AttendanceDto dto) {
        EmployeeDao employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        AttendanceDao entity = AttendanceMapper.toEntity(dto, employee);
        return AttendanceMapper.toDto(attendanceRepository.save(entity));
    }

    @Override
    public List<AttendanceDto> getAllAttendance() {
        return attendanceRepository.findAll().stream()
                .map(AttendanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AttendanceDto> getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .map(AttendanceMapper::toDto);
    }

    @Override
    public Optional<AttendanceDto> updateAttendance(Long id, AttendanceDto dto) {
        Optional<AttendanceDao> optionalAttendance = attendanceRepository.findById(id);
        if (optionalAttendance.isEmpty()) {
            return Optional.empty();
        }

        AttendanceDao attendance = optionalAttendance.get();

        EmployeeDao employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        attendance.setDate(dto.getDate());
        attendance.setCheckIn(dto.getCheckIn());
        attendance.setCheckOut(dto.getCheckOut());
        attendance.setStatus(dto.isStatus());
        attendance.setRemark(dto.getRemark());
        attendance.setEmployee(employee);

        AttendanceDao updated = attendanceRepository.save(attendance);
        return Optional.of(AttendanceMapper.toDto(updated));
    }

    @Override
    public boolean deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            return false;
        }
        attendanceRepository.deleteById(id);
        return true;
    }


    @Override
    public List<AttendanceDto> getAttendanceByEmployeeId(Long employeeId) {
        EmployeeDao employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        return attendanceRepository.findByEmployee(employee).stream()
                .map(AttendanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDto> getAttendanceByEmployeeIdAndDate(Long employeeId, LocalDate date) {
        EmployeeDao employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        return attendanceRepository.findByEmployeeAndDate(employee, date).stream()
                .map(AttendanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceDto punchIn(PunchDto dto) {
        EmployeeDao employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        LocalDate today = LocalDate.now();
        List<AttendanceDao> existing = attendanceRepository.findByEmployeeAndDate(employee, today);

        AttendanceDao attendance;
        if (existing.isEmpty()) {
            attendance = AttendanceDao.builder()
                    .employee(employee)
                    .date(today)
                    .checkIn(dto.getTime())
                    .status(true)
                    .build();
        } else {
            attendance = existing.get(0);
            attendance.setCheckIn(dto.getTime());
        }

        return AttendanceMapper.toDto(attendanceRepository.save(attendance));
    }

    @Override
    public AttendanceDto punchOut(PunchDto dto) {
        EmployeeDao employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        LocalDate today = LocalDate.now();
        List<AttendanceDao> existing = attendanceRepository.findByEmployeeAndDate(employee, today);

        if (existing.isEmpty()) {
            throw new IllegalStateException("Punch in first");
        }

        AttendanceDao attendance = existing.get(0);
        attendance.setCheckOut(dto.getTime());

        return AttendanceMapper.toDto(attendanceRepository.save(attendance));
    }

}

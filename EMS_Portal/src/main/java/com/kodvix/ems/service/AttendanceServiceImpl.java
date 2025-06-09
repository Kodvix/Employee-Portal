package com.kodvix.ems.service;

import com.kodvix.ems.dto.AttendanceDto;
import com.kodvix.ems.dto.PunchDto;
import com.kodvix.ems.entity.AttendanceDao;
import com.kodvix.ems.entity.EmployeeDao;
import com.kodvix.ems.exception.ResourceNotFoundException;
import com.kodvix.ems.repository.AttendanceRepository;
import com.kodvix.ems.repository.EmployeeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public AttendanceDto markAttendance(AttendanceDto dto) {
        EmployeeDao employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        AttendanceDao entity = convertToDao(dto, employee);
        AttendanceDao saved = attendanceRepository.save(entity);
        return convertToDto(saved);
    }

    @Override
    public List<AttendanceDto> getAllAttendance() {
        return attendanceRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AttendanceDto> getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .map(this::convertToDto);
    }

    @Override
    public Optional<AttendanceDto> updateAttendance(Long id, AttendanceDto dto) {
        Optional<AttendanceDao> optionalAttendance = attendanceRepository.findById(id);
        if (optionalAttendance.isEmpty()) {
            return Optional.empty();
        }

        EmployeeDao employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        AttendanceDao attendance = optionalAttendance.get();
        modelMapper.map(dto, attendance);
        attendance.setEmployee(employee);

        AttendanceDao updated = attendanceRepository.save(attendance);
        return Optional.of(convertToDto(updated));
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
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        return attendanceRepository.findByEmployee(employee).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDto> getAttendanceByEmployeeIdAndDate(Long employeeId, LocalDate date) {
        EmployeeDao employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        return attendanceRepository.findByEmployeeAndDate(employee, date).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceDto punchIn(PunchDto dto) {
        EmployeeDao employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();
        List<AttendanceDao> existing = attendanceRepository.findByEmployeeAndDate(employee, today);

        AttendanceDao attendance;
        if (existing.isEmpty()) {
            attendance = new AttendanceDao();
            attendance.setEmployee(employee);
            attendance.setDate(today);
            attendance.setCheckIn(dto.getTime());
            attendance.setStatus(true);
        } else {
            attendance = existing.get(0);
            attendance.setCheckIn(dto.getTime());
        }

        AttendanceDao saved = attendanceRepository.save(attendance);
        return convertToDto(saved);
    }

    @Override
    public AttendanceDto punchOut(PunchDto dto) {
        EmployeeDao employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();
        List<AttendanceDao> existing = attendanceRepository.findByEmployeeAndDate(employee, today);

        if (existing.isEmpty()) {
            throw new IllegalStateException("Punch in first");
        }

        AttendanceDao attendance = existing.get(0);
        attendance.setCheckOut(dto.getTime());

        AttendanceDao saved = attendanceRepository.save(attendance);
        return convertToDto(saved);
    }

    // Helper methods

    private AttendanceDto convertToDto(AttendanceDao attendanceDao) {
        AttendanceDto dto = modelMapper.map(attendanceDao, AttendanceDto.class);
        dto.setEmployeeId(attendanceDao.getEmployee().getId());
        return dto;
    }

    private AttendanceDao convertToDao(AttendanceDto attendanceDto, EmployeeDao employee) {
        AttendanceDao dao = modelMapper.map(attendanceDto, AttendanceDao.class);
        dao.setEmployee(employee);
        return dao;
    }
}

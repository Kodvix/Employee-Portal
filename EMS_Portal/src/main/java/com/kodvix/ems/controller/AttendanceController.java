package com.kodvix.ems.controller;

import com.kodvix.ems.dto.AttendanceDto;
import com.kodvix.ems.dto.PunchDto;
import com.kodvix.ems.entity.EmployeeDao;
import com.kodvix.ems.service.AttendanceService;
import com.kodvix.ems.repository.EmployeeRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendances")
@Tag(name = "Attendance API")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public AttendanceController(AttendanceService attendanceService, EmployeeRepository employeeRepository) {
        this.attendanceService = attendanceService;
        this.employeeRepository = employeeRepository;
    }

    @Operation(summary = "Mark attendance for an employee")
    @PostMapping
    public ResponseEntity<AttendanceDto> markAttendance(@RequestBody AttendanceDto dto) {
        Optional<EmployeeDao> employeeOpt = employeeRepository.findById(dto.getEmployeeId());
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        AttendanceDto saved = attendanceService.markAttendance(dto);
        return ResponseEntity.ok(saved);
    }

    @Operation(summary = "Get all attendance records")
    @GetMapping
    public ResponseEntity<List<AttendanceDto>> getAllAttendance() {
        List<AttendanceDto> list = attendanceService.getAllAttendance();
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Get attendance record by ID")
    @GetMapping("/{id}")
    public ResponseEntity<AttendanceDto> getAttendanceById(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Update attendance record by ID")
    @PutMapping("/{id}")
    public ResponseEntity<AttendanceDto> updateAttendance(@PathVariable Long id, @RequestBody AttendanceDto dto) {
        Optional<AttendanceDto> updated = attendanceService.updateAttendance(id, dto);
        return updated.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete attendance record by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        boolean deleted = attendanceService.deleteAttendance(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Get all attendance records for a specific employee")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByEmployeeId(@PathVariable Long employeeId) {
        List<AttendanceDto> list = attendanceService.getAttendanceByEmployeeId(employeeId);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Get attendance records for a specific employee on a given date")
    @GetMapping("/employee/{employeeId}/date/{date}")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByEmployeeIdAndDate(@PathVariable Long employeeId, @PathVariable LocalDate date) {
        List<AttendanceDto> list = attendanceService.getAttendanceByEmployeeIdAndDate(employeeId, date);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Record punch-in time for an employee")
    @PostMapping("/punch-in")
    public ResponseEntity<AttendanceDto> punchIn(@RequestBody PunchDto dto) {
        AttendanceDto punchedIn = attendanceService.punchIn(dto);
        return ResponseEntity.ok(punchedIn);
    }

    @Operation(summary = "Record punch-out time for an employee")
    @PostMapping("/punch-out")
    public ResponseEntity<AttendanceDto> punchOut(@RequestBody PunchDto dto) {
        AttendanceDto punchedOut = attendanceService.punchOut(dto);
        return ResponseEntity.ok(punchedOut);
    }

}
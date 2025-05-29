package com.employee.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.entity.AttendanceDao;
import com.employee.entity.EmployeeDao;

public interface AttendanceRepository extends JpaRepository<AttendanceDao, Long> {

    List<AttendanceDao> findByEmployee(EmployeeDao employee);

    List<AttendanceDao> findByEmployeeAndDate(EmployeeDao employee, LocalDate date);
}

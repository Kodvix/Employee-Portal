package com.kodvix.ems.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kodvix.ems.entity.AttendanceDao;
import com.kodvix.ems.entity.EmployeeDao;

public interface AttendanceRepository extends JpaRepository<AttendanceDao, Long> {

    List<AttendanceDao> findByEmployee(EmployeeDao employee);

    List<AttendanceDao> findByEmployeeAndDate(EmployeeDao employee, LocalDate date);
}

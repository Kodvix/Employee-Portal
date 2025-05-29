package com.employee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.entity.LeaveDao;

public interface LeaveRepository extends JpaRepository<LeaveDao, Long> {
    List<LeaveDao> findByEmployeeId(Long employeeId);
}

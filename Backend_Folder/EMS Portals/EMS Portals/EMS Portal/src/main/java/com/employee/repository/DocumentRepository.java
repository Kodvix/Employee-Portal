package com.employee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.entity.DocumentDao;

public interface DocumentRepository extends JpaRepository<DocumentDao, Long> {
    List<DocumentDao> findByEmployeeId(Long employeeId);
}

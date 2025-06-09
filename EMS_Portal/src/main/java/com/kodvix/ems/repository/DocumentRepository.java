package com.kodvix.ems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kodvix.ems.entity.DocumentDao;

public interface DocumentRepository extends JpaRepository<DocumentDao, Long> {
    List<DocumentDao> findByEmployeeId(Long employeeId);
}

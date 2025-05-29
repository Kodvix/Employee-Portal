package com.employee.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.entity.CompanyDocumentsDao;

public interface CompanyDocumentRepository extends JpaRepository<CompanyDocumentsDao, Long> {
    List<CompanyDocumentsDao> findByEmpId(Long empId);
}

package com.kodvix.ems.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kodvix.ems.entity.CompanyDocumentsDao;

public interface CompanyDocumentRepository extends JpaRepository<CompanyDocumentsDao, Long> {
    List<CompanyDocumentsDao> findByEmpId(Long empId);
}

package com.employee.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.entity.ProjectDao;

public interface ProjectRepository extends JpaRepository<ProjectDao, Long> {
    List<ProjectDao> findByCompanyId(Long companyId);
}


package com.kodvix.ems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kodvix.ems.entity.ProjectDao;

public interface ProjectRepository extends JpaRepository<ProjectDao, Long> {
    List<ProjectDao> findByCompanyId(Long companyId);
}


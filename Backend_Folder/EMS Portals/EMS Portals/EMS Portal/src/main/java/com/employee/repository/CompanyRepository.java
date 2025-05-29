package com.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.entity.CompanyDao;

public interface CompanyRepository extends JpaRepository<CompanyDao, Long> {}


package com.kodvix.ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kodvix.ems.entity.CompanyDao;

public interface CompanyRepository extends JpaRepository<CompanyDao, Long> {}


package com.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.employee.entity.AssistRequestDao;

@Repository
public interface AssistRequestRepository extends JpaRepository<AssistRequestDao, Long> {
}

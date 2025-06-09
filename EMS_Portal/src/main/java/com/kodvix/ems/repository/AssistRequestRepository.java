package com.kodvix.ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kodvix.ems.entity.AssistRequestDao;

@Repository
public interface AssistRequestRepository extends JpaRepository<AssistRequestDao, Long> {
}

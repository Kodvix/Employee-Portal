package com.employee.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.entity.HRComplaintDao;

public interface HRComplaintRepository extends JpaRepository<HRComplaintDao, Long> {
}

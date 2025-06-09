package com.kodvix.ems.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kodvix.ems.entity.HRComplaintDao;

public interface HRComplaintRepository extends JpaRepository<HRComplaintDao, Long> {
}

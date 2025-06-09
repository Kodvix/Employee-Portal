package com.kodvix.ems.repository;

import com.kodvix.ems.entity.HRHolidayInformationDao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HRHolidayInformationRepository extends JpaRepository<HRHolidayInformationDao,Long> {
}

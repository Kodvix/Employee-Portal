package com.employee.repository;

import com.employee.dto.HRHolidayInformationDto;
import com.employee.entity.HRHolidayInformationDao;
import lombok.Data;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HRHolidayInformationRepository extends JpaRepository<HRHolidayInformationDao,Long> {
}

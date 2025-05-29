package com.employee.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.entity.AddressDao;

public interface AddressRepository extends JpaRepository<AddressDao, Long> {
    Optional<AddressDao> findByEmployeeId(Long employeeId);
}

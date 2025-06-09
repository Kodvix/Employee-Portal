package com.kodvix.ems.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kodvix.ems.entity.AddressDao;

public interface AddressRepository extends JpaRepository<AddressDao, Long> {
    Optional<AddressDao> findByEmployeeId(Long employeeId);
}

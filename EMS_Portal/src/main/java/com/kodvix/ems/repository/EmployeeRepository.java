package com.kodvix.ems.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kodvix.ems.entity.EmployeeDao;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeDao, Long> {
    Optional<EmployeeDao> findByEmail(String email);
    Optional<EmployeeDao> findByPhone(String phone);
    boolean existsByEmail(String email);
    List<EmployeeDao> findByDepartment(String department);

    Long findEmployeeIdByEmail(String email);
}

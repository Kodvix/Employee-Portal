package com.employee.repository;

import com.employee.entity.UserDao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<UserDao, Long> {
    Optional<UserDao> findByEmail(String email);
}



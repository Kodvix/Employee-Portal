package com.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employee.entity.EventDao;

public interface EventRepository extends JpaRepository<EventDao, Long> {
	
}

package com.kodvix.ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kodvix.ems.entity.EventDao;

public interface EventRepository extends JpaRepository<EventDao, Long> {
	
}

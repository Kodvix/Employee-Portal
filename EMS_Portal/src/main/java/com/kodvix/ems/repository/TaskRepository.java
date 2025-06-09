package com.kodvix.ems.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kodvix.ems.entity.TaskDao;

public interface TaskRepository extends JpaRepository<TaskDao, Long> {
    List<TaskDao> findByProjectId(Long projectId);

    List<TaskDao> findByEmpId(Long empId);
    List<TaskDao> findByAssignedTo(String assignedTo);
}

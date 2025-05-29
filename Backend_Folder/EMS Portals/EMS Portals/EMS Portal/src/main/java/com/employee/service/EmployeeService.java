package com.employee.service;

import java.util.List;
import java.util.Optional;

import com.employee.entity.EmployeeDao;

public interface EmployeeService {

    EmployeeDao saveEmployee(EmployeeDao employee);

    List<EmployeeDao> getAllEmployees();

    Optional<EmployeeDao> getEmployeeById(Long id);

    void deleteEmployee(Long id);

    boolean emailExists(String email);

    Optional<EmployeeDao> getEmployeeByEmail(String email);

    List<EmployeeDao> getEmployeesByDepartment(String department);
}

package com.employee.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.entity.EmployeeDao;
import com.employee.repository.EmployeeRepository;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public EmployeeDao saveEmployee(EmployeeDao employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public List<EmployeeDao> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Optional<EmployeeDao> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public boolean emailExists(String email) {
        return employeeRepository.existsByEmail(email);
    }

    @Override
    public Optional<EmployeeDao> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    @Override
    public List<EmployeeDao> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }
}

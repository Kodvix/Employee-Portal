package com.kodvix.ems.service;

import com.kodvix.ems.dto.EmployeeDto;
import com.kodvix.ems.entity.EmployeeDao;
import com.kodvix.ems.repository.EmployeeRepository;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public EmployeeDto createEmployee(EmployeeDto dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        EmployeeDao saved = employeeRepository.save(convertToDao(dto));
        return convertToDto(saved);
    }

    @Override
    public List<EmployeeDto> getAllEmployeesDto() {
        return employeeRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDto getEmployeeByIdDto(Long id) {
        EmployeeDao employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + id));
        return convertToDto(employee);
    }

    @Override
    public EmployeeDto updateEmployee(Long id, EmployeeDto dto) {
        EmployeeDao employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + id));
        modelMapper.map(dto, employee);
        EmployeeDao updated = employeeRepository.save(employee);
        return convertToDto(updated);
    }


    @Override
    public String deleteEmployeeById(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new IllegalArgumentException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
        return "Employee Deleted Successfully";
    }

    @Override
    public EmployeeDto getEmployeeByEmailDto(String email) {
        EmployeeDao employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with email: " + email));
        return convertToDto(employee);
    }

    @Override
    public List<EmployeeDto> getEmployeesByDepartmentDto(String department) {
        return employeeRepository.findByDepartment(department)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Helper methods
    private EmployeeDto convertToDto(EmployeeDao dao) {
        return modelMapper.map(dao, EmployeeDto.class);
    }

    private EmployeeDao convertToDao(EmployeeDto dto) {
        return modelMapper.map(dto, EmployeeDao.class);
    }
}

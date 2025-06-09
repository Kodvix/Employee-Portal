package com.kodvix.ems.service;

import com.kodvix.ems.dto.EmployeeDto;
import java.util.List;

public interface EmployeeService {

    EmployeeDto createEmployee(EmployeeDto dto);

    List<EmployeeDto> getAllEmployeesDto();

    EmployeeDto getEmployeeByIdDto(Long id);

    EmployeeDto updateEmployee(Long id, EmployeeDto dto);

    String deleteEmployeeById(Long id);

    EmployeeDto getEmployeeByEmailDto(String email);

    List<EmployeeDto> getEmployeesByDepartmentDto(String department);
}

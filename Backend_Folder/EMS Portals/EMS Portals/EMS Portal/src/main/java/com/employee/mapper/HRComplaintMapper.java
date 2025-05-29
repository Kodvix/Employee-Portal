package com.employee.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.employee.dto.HRComplaintDto;
import com.employee.entity.EmployeeDao;
import com.employee.entity.HRComplaintDao;
import com.employee.repository.EmployeeRepository;

@Component
public class HRComplaintMapper {

    @Autowired
    private EmployeeRepository employeeRepository;

    public HRComplaintDao toEntity(HRComplaintDto dto) {
        if (dto == null) return null;

        EmployeeDao employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + dto.getEmployeeId()));

        return HRComplaintDao.builder()
                .id(dto.getId())
                .type(dto.getType())
                .description(dto.getDescription())
                .hrdoc(dto.getHrdoc())
                .employee(employee)
                .submittedDate(dto.getSubmittedDate())
                .status(dto.getStatus())
                .build();
    }

    public HRComplaintDto toDto(HRComplaintDao entity) {
        if (entity == null) return null;

        HRComplaintDto dto = new HRComplaintDto();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setDescription(entity.getDescription());
        dto.setHrdoc(entity.getHrdoc());
        dto.setSubmittedDate(entity.getSubmittedDate());
        dto.setStatus(entity.getStatus());

        if (entity.getEmployee() != null) {
            dto.setEmployeeId(entity.getEmployee().getId());
            dto.setFirstName(entity.getEmployee().getFirstName());
            dto.setLastName(entity.getEmployee().getLastName());
            dto.setDepartment(entity.getEmployee().getDepartment());
        }

        return dto;
    }
}

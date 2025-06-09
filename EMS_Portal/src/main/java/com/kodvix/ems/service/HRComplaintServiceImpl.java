package com.kodvix.ems.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.kodvix.ems.entity.EmployeeDao;
import com.kodvix.ems.repository.EmployeeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kodvix.ems.dto.HRComplaintDto;
import com.kodvix.ems.entity.HRComplaintDao;
import com.kodvix.ems.exception.ResourceNotFoundException;
import com.kodvix.ems.repository.HRComplaintRepository;

@Service
public class HRComplaintServiceImpl implements HRComplaintService {

    @Autowired
    private HRComplaintRepository repository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private EmployeeRepository employeeRepository;


    @Override
    public HRComplaintDto saveComplaint(HRComplaintDto dto) {
        HRComplaintDao entity = convertToDao(dto);

        if (dto.getSubmittedDate() == null) {
            entity.setSubmittedDate(LocalDateTime.now());
        }
        if (dto.getStatus() == null || dto.getStatus().isEmpty()) {
            entity.setStatus("Pending");
        }

        HRComplaintDao savedEntity = repository.save(entity);
        return convertToDto(savedEntity);
    }

    @Override
    public List<HRComplaintDto> getAllComplaints() {
        return convertToDtoList(repository.findAll());
    }

    @Override
    public HRComplaintDto updateComplaint(Long id, HRComplaintDto dto) {
        HRComplaintDao existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        existing.setType(dto.getType());
        existing.setDescription(dto.getDescription());

        if (dto.getHrdoc() != null) {
            existing.setHrdoc(dto.getHrdoc());
        }

        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }

        return convertToDto(repository.save(existing));
    }

    @Override
    public HRComplaintDto getComplaintById(Long id) {
        HRComplaintDao entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
        return convertToDto(entity);
    }

    @Override
    public void deleteComplaint(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Complaint not found with id: " + id);
        }
        repository.deleteById(id);
    }

    // Helper methods

    private HRComplaintDto convertToDto(HRComplaintDao entity) {
        HRComplaintDto dto = modelMapper.map(entity, HRComplaintDto.class);

        if (entity.getEmployee() != null) {
            dto.setEmployeeId(entity.getEmployee().getId());
            dto.setFirstName(entity.getEmployee().getFirstName());
            dto.setLastName(entity.getEmployee().getLastName());
            dto.setDepartment(entity.getEmployee().getDepartment());
        }

        return dto;
    }

    private HRComplaintDao convertToDao(HRComplaintDto dto) {
        HRComplaintDao complaint = modelMapper.map(dto, HRComplaintDao.class);

        if (dto.getEmployeeId() != null) {
            EmployeeDao employee = employeeRepository.findById(dto.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + dto.getEmployeeId()));
            complaint.setEmployee(employee);
        }

        return complaint;
    }


    private List<HRComplaintDto> convertToDtoList(List<HRComplaintDao> daoList) {
        return daoList.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}

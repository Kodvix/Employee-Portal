package com.employee.service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.dto.HRComplaintDto;
import com.employee.entity.HRComplaintDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.mapper.HRComplaintMapper;
import com.employee.repository.HRComplaintRepository;

@Service
public class HRComplaintServiceImpl implements HRComplaintService {

    @Autowired
    private HRComplaintRepository repository;

    @Autowired
    private HRComplaintMapper mapper;

    @Override
    public HRComplaintDto saveComplaint(HRComplaintDto dto) {
        HRComplaintDao entity = mapper.toEntity(dto);

        if (dto.getSubmittedDate() == null) {
            entity.setSubmittedDate(LocalDateTime.now());
        }
        if (dto.getStatus() == null || dto.getStatus().isEmpty()) {
            entity.setStatus("Pending");
        }

        HRComplaintDao savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }

    @Override
    public List<HRComplaintDto> getAllComplaints() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
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

        return mapper.toDto(repository.save(existing));
    }


    @Override
    public HRComplaintDto getComplaintById(Long id) {
    	HRComplaintDao entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
        return mapper.toDto(entity);
    }

    @Override
    public void deleteComplaint(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Complaint not found with id: " + id);
        }
        repository.deleteById(id);
    }
}

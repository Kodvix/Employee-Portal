package com.employee.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.dto.AssistRequestDto;
import com.employee.entity.AssistRequestDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.mapper.AssistRequestMapper;
import com.employee.repository.AssistRequestRepository;

@Service
public class AssistRequestServiceImpl implements AssistRequestService {

    private final AssistRequestRepository assistRequestRepository;

    @Autowired
    public AssistRequestServiceImpl(AssistRequestRepository assistRequestRepository) {
        this.assistRequestRepository = assistRequestRepository;
    }

    @Override
    public AssistRequestDto createAssistRequest(AssistRequestDto dto) {
        try {
            AssistRequestDao assistRequestDao = AssistRequestMapper.toEntity(dto);
            AssistRequestDao savedAssistRequest = assistRequestRepository.save(assistRequestDao);
            return AssistRequestMapper.toDto(savedAssistRequest);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create assist request: " + e.getMessage(), e);
        }
    }

   
    @Override
    public List<AssistRequestDto> getAllAssistRequests() {
        try {
            List<AssistRequestDao> assistRequests = assistRequestRepository.findAll();
            return assistRequests.stream()
                    .map(AssistRequestMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch assist requests: " + e.getMessage(), e);
        }
    }

    @Override
    public AssistRequestDto getAssistRequestById(Long id) {
        try {
            AssistRequestDao assistRequest = assistRequestRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Assist Request not found with ID: " + id));
            return AssistRequestMapper.toDto(assistRequest);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve assist request: " + e.getMessage(), e);
        }
    }

    @Override
    public AssistRequestDto updateAssistRequest(Long id, AssistRequestDto dto) {
        try {
            AssistRequestDao existingRequest = assistRequestRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Assist Request not found with ID: " + id));

            existingRequest.setType(dto.getType());
            existingRequest.setJustification(dto.getJustification());
            existingRequest.setNeededByDate(dto.getNeededByDate());

            AssistRequestDao updatedRequest = assistRequestRepository.save(existingRequest);
            return AssistRequestMapper.toDto(updatedRequest);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update assist request: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean deleteAssistRequest(Long id) {
        try {
            AssistRequestDao assistRequest = assistRequestRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Assist Request not found with ID: " + id));

            assistRequestRepository.delete(assistRequest);
            return true;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete assist request: " + e.getMessage(), e);
        }
    }

}

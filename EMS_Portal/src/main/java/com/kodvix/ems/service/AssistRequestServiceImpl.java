package com.kodvix.ems.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kodvix.ems.dto.AssistRequestDto;
import com.kodvix.ems.entity.AssistRequestDao;
import com.kodvix.ems.exception.ResourceNotFoundException;
import com.kodvix.ems.repository.AssistRequestRepository;

@Service
public class AssistRequestServiceImpl implements AssistRequestService {

    @Autowired
    private AssistRequestRepository assistRequestRepository;
    @Autowired
    private ModelMapper modelMapper;


    @Override
    public AssistRequestDto createAssistRequest(AssistRequestDto dto) {
        try {
            AssistRequestDao assistRequestDao = convertToDao(dto);
            AssistRequestDao savedAssistRequest = assistRequestRepository.save(assistRequestDao);
            return convertToDto(savedAssistRequest);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create assist request: " + e.getMessage(), e);
        }
    }

    @Override
    public List<AssistRequestDto> getAllAssistRequests() {
        try {
            List<AssistRequestDao> assistRequests = assistRequestRepository.findAll();
            return assistRequests.stream()
                    .map(this::convertToDto)
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
            return convertToDto(assistRequest);
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
            return convertToDto(updatedRequest);
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

    // Helper methods to convert between DTO and DAO
    private AssistRequestDao convertToDao(AssistRequestDto dto) {
        return modelMapper.map(dto, AssistRequestDao.class);
    }

    private AssistRequestDto convertToDto(AssistRequestDao dao) {
        return modelMapper.map(dao, AssistRequestDto.class);
    }
}
package com.employee.service;

import java.util.List;

import com.employee.dto.AssistRequestDto;

public interface AssistRequestService {
    AssistRequestDto createAssistRequest(AssistRequestDto dto);
    List<AssistRequestDto> getAllAssistRequests();
    AssistRequestDto getAssistRequestById(Long id);
    AssistRequestDto updateAssistRequest(Long id, AssistRequestDto dto);
    boolean deleteAssistRequest(Long id);
}

package com.employee.service;
import java.util.List;

import com.employee.dto.HRComplaintDto;

public interface HRComplaintService {

    HRComplaintDto saveComplaint(HRComplaintDto dto);
    List<HRComplaintDto> getAllComplaints();
    HRComplaintDto getComplaintById(Long id);
    void deleteComplaint(Long id);
    HRComplaintDto updateComplaint(Long id, HRComplaintDto dto);
}

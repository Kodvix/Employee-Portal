package com.kodvix.ems.service;
import java.util.List;

import com.kodvix.ems.dto.HRComplaintDto;

public interface HRComplaintService {

    HRComplaintDto saveComplaint(HRComplaintDto dto);
    List<HRComplaintDto> getAllComplaints();
    HRComplaintDto getComplaintById(Long id);
    void deleteComplaint(Long id);
    HRComplaintDto updateComplaint(Long id, HRComplaintDto dto);
}

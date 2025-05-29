package com.employee.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employee.dto.EventDto;
import com.employee.dto.LeaveDto;
import com.employee.entity.EmployeeDao;
import com.employee.entity.EventDao;
import com.employee.entity.LeaveDao;
import com.employee.mapper.LeaveMapper;
import com.employee.repository.EmployeeRepository;
import com.employee.repository.LeaveRepository;

@Service
public class LeaveServiceImpl implements LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public LeaveDto applyLeave(Long employeeId, LeaveDto leaveDto) {
        EmployeeDao employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));

        LeaveDao leaveEntity = LeaveMapper.toEntity(leaveDto, employee);
        LeaveDao savedLeave = leaveRepository.save(leaveEntity);
        return LeaveMapper.toDto(savedLeave);
    }
    
    @Override
    public List<LeaveDto> getAllLeaves(){
    	return convertToDtoList(leaveRepository.findAll());
    }


    @Override
    public List<LeaveDto> getLeavesByEmployee(Long employeeId) {
        List<LeaveDao> leaves = leaveRepository.findByEmployeeId(employeeId);
        return leaves.stream()
                .map(LeaveMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<LeaveDto> getLeaveById(Long leaveId) {
        return leaveRepository.findById(leaveId)
                .map(LeaveMapper::toDto);
    }

    @Override
    public void deleteLeave(Long leaveId) {
        leaveRepository.deleteById(leaveId);
    }

    @Override
    public LeaveDto updateLeave(LeaveDto leaveDto) {
        LeaveDao existingLeave = leaveRepository.findById(leaveDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Leave not found with ID: " + leaveDto.getId()));

        existingLeave.setLeaveType(leaveDto.getLeaveType());
        existingLeave.setStartDate(leaveDto.getStartDate());
        existingLeave.setEndDate(leaveDto.getEndDate());
        existingLeave.setReason(leaveDto.getReason());
        existingLeave.setStatus(leaveDto.getStatus());

        if (leaveDto.getLeaveDoc() != null && leaveDto.getLeaveDoc().length > 0) {
            existingLeave.setLeaveDoc(leaveDto.getLeaveDoc());
        }

        LeaveDao updatedLeave = leaveRepository.save(existingLeave);
        return LeaveMapper.toDto(updatedLeave);
    }


    private LeaveDto convertToDto(LeaveDao event) {
		return modelMapper.map(event, LeaveDto.class);
	}

	private List<LeaveDto> convertToDtoList(List<LeaveDao> eventlist) {
		return eventlist.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	private LeaveDao convertToDao(LeaveDto eventDto) {
		return modelMapper.map(eventDto, LeaveDao.class);
	}
}

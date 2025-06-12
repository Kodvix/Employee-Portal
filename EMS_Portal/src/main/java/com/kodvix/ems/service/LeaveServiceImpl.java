package com.kodvix.ems.service;

import com.kodvix.ems.dto.LeaveDto;
import com.kodvix.ems.entity.EmployeeDao;
import com.kodvix.ems.entity.LeaveDao;
import com.kodvix.ems.exception.ResourceNotFoundException;
import com.kodvix.ems.repository.EmployeeRepository;
import com.kodvix.ems.repository.LeaveRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        LeaveDao leaveEntity = convertToDao(leaveDto);
        leaveEntity.setEmployee(employee);
        LeaveDao savedLeave = leaveRepository.save(leaveEntity);
        return convertToDto(savedLeave);
    }

    @Override
    public List<LeaveDto> getAllLeaves() {
        return convertToDtoList(leaveRepository.findAll());
    }

    @Override
    public List<LeaveDto> getLeavesByEmployee(Long employeeId) {
        List<LeaveDao> leaves = leaveRepository.findByEmployeeId(employeeId);
        return convertToDtoList(leaves);
    }

    @Override
    public Optional<LeaveDto> getLeaveById(Long leaveId) {
        return leaveRepository.findById(leaveId)
                .map(this::convertToDto);
    }

    @Override
    public void deleteLeave(Long leaveId) {
        leaveRepository.deleteById(leaveId);
    }

    @Override
    public LeaveDto updateLeave(LeaveDto leaveDto) {
        LeaveDao existingLeave = leaveRepository.findById(leaveDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Leave not found with ID: " + leaveDto.getId()));

        modelMapper.map(leaveDto, existingLeave);

        if (leaveDto.getLeaveDoc() != null && leaveDto.getLeaveDoc().length > 0) {
            existingLeave.setLeaveDoc(leaveDto.getLeaveDoc());
        }

        LeaveDao updatedLeave = leaveRepository.save(existingLeave);
        return convertToDto(updatedLeave);
    }

    // Helper methods

    private LeaveDto convertToDto(LeaveDao leaveDao) {
        LeaveDto dto = modelMapper.map(leaveDao, LeaveDto.class);
        if (leaveDao.getEmployee() != null) {
            dto.setEmployeeId(leaveDao.getEmployee().getId());
            dto.setFirstName(leaveDao.getEmployee().getFirstName());
            dto.setLastName(leaveDao.getEmployee().getLastName());
            dto.setDepartment(leaveDao.getEmployee().getDepartment());
        }
        return dto;
    }

    private LeaveDao convertToDao(LeaveDto leaveDto) {
        return modelMapper.map(leaveDto, LeaveDao.class);
    }

    private List<LeaveDto> convertToDtoList(List<LeaveDao> daoList) {
        return daoList.stream().map(this::convertToDto).collect(Collectors.toList());
    }
}

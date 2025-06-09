package com.kodvix.ems.service;

import com.kodvix.ems.dto.AddressDto;
import com.kodvix.ems.entity.AddressDao;
import com.kodvix.ems.entity.EmployeeDao;
import com.kodvix.ems.exception.ResourceNotFoundException;
import com.kodvix.ems.repository.AddressRepository;
import com.kodvix.ems.repository.EmployeeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public AddressDto saveAddressForEmployee(Long employeeId, AddressDto dto) {
        EmployeeDao employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        if (addressRepository.findByEmployeeId(employeeId).isPresent()) {
            throw new IllegalStateException("Employee already has an address. Use update instead.");
        }

        AddressDao address = convertToDao(dto);
        address.setEmployee(employee);
        return convertToDto(addressRepository.save(address));
    }

    @Override
    public AddressDto getAddressByEmployee(Long employeeId) {
        AddressDao address = addressRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("No address found for employee ID: " + employeeId));
        return convertToDto(address);
    }

    @Override
    public Optional<AddressDto> getAddressById(Long id) {
        return addressRepository.findById(id)
                .map(this::convertToDto);
    }

    @Override
    public AddressDto updateAddressByEmployeeId(Long employeeId, AddressDto dto) {
        EmployeeDao employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        AddressDao existing = addressRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("No address found for employee ID: " + employeeId));

        modelMapper.map(dto, existing);
        existing.setEmployee(employee);

        return convertToDto(addressRepository.save(existing));
    }

    @Override
    public void deleteAddress(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new ResourceNotFoundException("Address not found with ID: " + id);
        }
        addressRepository.deleteById(id);
    }

    // Helper methods
    private AddressDto convertToDto(AddressDao addressDao) {
        AddressDto dto = modelMapper.map(addressDao, AddressDto.class);
        if (addressDao.getEmployee() != null) {
            dto.setEmployeeId(addressDao.getEmployee().getId());
        }
        return dto;
    }

    private AddressDao convertToDao(AddressDto dto) {
        return modelMapper.map(dto, AddressDao.class);
    }
}
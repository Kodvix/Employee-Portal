package com.employee.service;

import com.employee.dto.AddressDto;
import com.employee.entity.AddressDao;
import com.employee.entity.EmployeeDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.mapper.AddressMapper;
import com.employee.repository.AddressRepository;
import com.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final EmployeeRepository employeeRepository;
    private final AddressMapper addressMapper;

    @Override
    public AddressDto saveAddressForEmployee(Long employeeId, AddressDto dto) {
        EmployeeDao employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        // Prevent duplicate address entry
        if (addressRepository.findByEmployeeId(employeeId).isPresent()) {
            throw new IllegalStateException("Employee already has an address. Use update instead.");
        }

        AddressDao address = addressMapper.toEntity(dto, employee);
        return addressMapper.toDto(addressRepository.save(address));
    }

    @Override
    public AddressDto getAddressByEmployee(Long employeeId) {
        AddressDao address = addressRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("No address found for employee ID: " + employeeId));
        return addressMapper.toDto(address);
    }

    @Override
    public Optional<AddressDto> getAddressById(Long id) {
        return addressRepository.findById(id)
                .map(addressMapper::toDto);
    }

    @Override
    public AddressDto updateAddressByEmployeeId(Long employeeId, AddressDto dto) {
        EmployeeDao employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        AddressDao existing = addressRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("No address found for employee ID: " + employeeId));

        existing.setStreet(dto.getStreet());
        existing.setCity(dto.getCity());
        existing.setState(dto.getState());
        existing.setPostalCode(dto.getPostalCode());
        existing.setCountry(dto.getCountry());

        return addressMapper.toDto(addressRepository.save(existing));
    }

    @Override
    public void deleteAddress(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new ResourceNotFoundException("Address not found with ID: " + id);
        }
        addressRepository.deleteById(id);
    }
}

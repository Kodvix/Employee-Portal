package com.employee.service;

import com.employee.dto.AddressDto;

import java.util.Optional;

public interface AddressService {

    AddressDto saveAddressForEmployee(Long employeeId, AddressDto dto);
    AddressDto getAddressByEmployee(Long employeeId);
    Optional<AddressDto> getAddressById(Long id);
    AddressDto updateAddressByEmployeeId(Long employeeId, AddressDto dto);
    void deleteAddress(Long id);
}

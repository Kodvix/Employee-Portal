package com.employee.servicetest;

import com.employee.dto.AddressDto;
import com.employee.entity.AddressDao;
import com.employee.entity.EmployeeDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.mapper.AddressMapper;
import com.employee.repository.AddressRepository;
import com.employee.repository.EmployeeRepository;
import com.employee.service.AddressServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AddressServiceImplTest {

    private AddressRepository addressRepository;
    private EmployeeRepository employeeRepository;
    private AddressMapper addressMapper;
    private AddressServiceImpl addressService;

    @BeforeEach
    void setUp() {
        addressRepository = mock(AddressRepository.class);
        employeeRepository = mock(EmployeeRepository.class);
        addressMapper = mock(AddressMapper.class);
        addressService = new AddressServiceImpl(addressRepository, employeeRepository, addressMapper);
    }

    @Test
    void saveAddressForEmployee() {
        Long employeeId = 1L;
        AddressDto dto = new AddressDto();
        EmployeeDao employee = new EmployeeDao();
        AddressDao address = new AddressDao();
        AddressDao saved = new AddressDao();
        AddressDto expectedDto = new AddressDto();

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(addressRepository.findByEmployeeId(employeeId)).thenReturn(Optional.empty());
        when(addressMapper.toEntity(dto, employee)).thenReturn(address);
        when(addressRepository.save(address)).thenReturn(saved);
        when(addressMapper.toDto(saved)).thenReturn(expectedDto);

        AddressDto result = addressService.saveAddressForEmployee(employeeId, dto);

        assertEquals(expectedDto, result);
        verify(employeeRepository).findById(employeeId);
        verify(addressRepository).findByEmployeeId(employeeId);
        verify(addressRepository).save(address);
    }

  

   

    @Test
    void getAddressByEmployee() {
        Long employeeId = 1L;
        AddressDao address = new AddressDao();
        AddressDto dto = new AddressDto();

        when(addressRepository.findByEmployeeId(employeeId)).thenReturn(Optional.of(address));
        when(addressMapper.toDto(address)).thenReturn(dto);

        AddressDto result = addressService.getAddressByEmployee(employeeId);

        assertEquals(dto, result);
        verify(addressRepository).findByEmployeeId(employeeId);
    }

   

    @Test
    void getAddressById() {
        Long id = 1L;
        AddressDao address = new AddressDao();
        AddressDto dto = new AddressDto();

        when(addressRepository.findById(id)).thenReturn(Optional.of(address));
        when(addressMapper.toDto(address)).thenReturn(dto);

        Optional<AddressDto> result = addressService.getAddressById(id);

        assertTrue(result.isPresent());
        assertEquals(dto, result.get());
    }

   
    @Test
    void updateAddressByEmployeeId() {
        Long employeeId = 1L;
        AddressDto dto = new AddressDto();
        EmployeeDao employee = new EmployeeDao();
        AddressDao existing = new AddressDao();
        AddressDao updated = new AddressDao();
        AddressDto expectedDto = new AddressDto();

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(addressRepository.findByEmployeeId(employeeId)).thenReturn(Optional.of(existing));
        when(addressRepository.save(existing)).thenReturn(updated);
        when(addressMapper.toDto(updated)).thenReturn(expectedDto);

        AddressDto result = addressService.updateAddressByEmployeeId(employeeId, dto);

        assertEquals(expectedDto, result);
        verify(addressRepository).save(existing);
    }

   

  

    @Test
    void deleteAddress() {
        Long id = 1L;
        when(addressRepository.existsById(id)).thenReturn(true);

        addressService.deleteAddress(id);

        verify(addressRepository).deleteById(id);
    }

   
}

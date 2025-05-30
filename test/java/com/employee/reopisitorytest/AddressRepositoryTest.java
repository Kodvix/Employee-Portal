package com.employee.reopisitorytest;

import com.employee.entity.AddressDao;
import com.employee.entity.EmployeeDao;
import com.employee.repository.AddressRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AddressRepositoryTest {

    @Mock
    private AddressRepository addressRepository;

    private EmployeeDao mockEmployee;
    private AddressDao mockAddress;

    @BeforeEach
    void setup() {
        mockEmployee = EmployeeDao.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .build();

        mockAddress = AddressDao.builder()
                .id(1L)
                .street("123 Main St")
                .city("Springfield")
                .state("IL")
                .postalCode("62701")
                .country("USA")
                .employee(mockEmployee)
                .build();
    }

    @Test
    public void testFindByEmployeeId_Found() {
        when(addressRepository.findByEmployeeId(1L)).thenReturn(Optional.of(mockAddress));

        Optional<AddressDao> optionalAddress = addressRepository.findByEmployeeId(1L);

        assertTrue(optionalAddress.isPresent());
        assertEquals("123 Main St", optionalAddress.get().getStreet());

        verify(addressRepository, times(1)).findByEmployeeId(1L);
    }

    @Test
    public void testFindByEmployeeId_NotFound() {
        when(addressRepository.findByEmployeeId(2L)).thenReturn(Optional.empty());

        Optional<AddressDao> optionalAddress = addressRepository.findByEmployeeId(2L);

        assertFalse(optionalAddress.isPresent());

        verify(addressRepository, times(1)).findByEmployeeId(2L);
    }
}

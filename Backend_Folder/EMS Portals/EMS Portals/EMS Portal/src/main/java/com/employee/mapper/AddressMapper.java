package com.employee.mapper;

import com.employee.dto.AddressDto;
import com.employee.entity.AddressDao;
import com.employee.entity.EmployeeDao;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public AddressDao toEntity(AddressDto dto, EmployeeDao employee) {
        if (dto == null) return null;

        return AddressDao.builder()
                .id(dto.getId())
                .street(dto.getStreet())
                .city(dto.getCity())
                .state(dto.getState())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .employee(employee)
                .build();
    }

    public AddressDto toDto(AddressDao entity) {
        if (entity == null) return null;

        AddressDto dto = new AddressDto();
        dto.setId(entity.getId());
        dto.setStreet(entity.getStreet());
        dto.setCity(entity.getCity());
        dto.setState(entity.getState());
        dto.setPostalCode(entity.getPostalCode());
        dto.setCountry(entity.getCountry());

        if (entity.getEmployee() != null) {
            dto.setEmployeeId(entity.getEmployee().getId());
        }

        return dto;
    }
}
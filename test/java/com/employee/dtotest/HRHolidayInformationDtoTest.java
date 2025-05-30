package com.employee.dtotest;

import org.junit.jupiter.api.Test;

import com.employee.dto.HRHolidayInformationDto;

import static org.junit.jupiter.api.Assertions.*;

class HRHolidayInformationDtoTest {

    @Test
    void testGettersAndSetters() {
        HRHolidayInformationDto dto = new HRHolidayInformationDto();

        dto.setHolidayId(100L);
        dto.setNameOfHoliday("New Year");
        dto.setDescription("New Year's Day Holiday");
        dto.setDate("2025-01-01");  // <-- String instead of LocalDate

        assertEquals(100L, dto.getHolidayId());
        assertEquals("New Year", dto.getNameOfHoliday());
        assertEquals("New Year's Day Holiday", dto.getDescription());
        assertEquals("2025-01-01", dto.getDate());
    }

    @Test
    void testToStringNotNull() {
        HRHolidayInformationDto dto = new HRHolidayInformationDto();
        dto.setHolidayId(1L);
        dto.setNameOfHoliday("Test Holiday");
        dto.setDescription("Description");
        dto.setDate("2025-05-29");

        assertNotNull(dto.toString());
        assertFalse(dto.toString().isEmpty());
    }
}

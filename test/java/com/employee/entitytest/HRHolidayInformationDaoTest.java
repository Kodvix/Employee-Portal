package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.HRHolidayInformationDao;

import static org.junit.jupiter.api.Assertions.*;

class HRHolidayInformationDaoTest {

    @Test
    void testNoArgsConstructorAndSettersGetters() {
        HRHolidayInformationDao holiday = new HRHolidayInformationDao();

        holiday.setHolidayId(100L);
        holiday.setNameOfHoliday("New Year");
        holiday.setDescription("New Year's Day Holiday");
        holiday.setDate("2025-01-01");

        assertEquals(100L, holiday.getHolidayId());
        assertEquals("New Year", holiday.getNameOfHoliday());
        assertEquals("New Year's Day Holiday", holiday.getDescription());
        assertEquals("2025-01-01", holiday.getDate());
    }

    @Test
    void testAllArgsConstructorAndBuilderIfNeeded() {
        // Since you only have @Data (no @AllArgsConstructor or @Builder), these won't be available.
        // So you can test with setter-based initialization only.
        HRHolidayInformationDao holiday = new HRHolidayInformationDao();
        holiday.setHolidayId(200L);
        holiday.setNameOfHoliday("Independence Day");
        holiday.setDescription("Independence Day Holiday");
        holiday.setDate("2025-07-04");

        assertAll("Check fields",
                () -> assertEquals(200L, holiday.getHolidayId()),
                () -> assertEquals("Independence Day", holiday.getNameOfHoliday()),
                () -> assertEquals("Independence Day Holiday", holiday.getDescription()),
                () -> assertEquals("2025-07-04", holiday.getDate())
        );
    }
}

package com.employee.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class HRHolidayInformationDto {

    private Long holidayId;
    private String nameOfHoliday;
    private String description;
    private String date;
}

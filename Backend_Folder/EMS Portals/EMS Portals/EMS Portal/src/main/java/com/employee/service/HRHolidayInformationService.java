package com.employee.service;

import com.employee.dto.HRHolidayInformationDto;

import java.util.List;

public interface HRHolidayInformationService {

    HRHolidayInformationDto createHoliday(HRHolidayInformationDto holiday);

    List<HRHolidayInformationDto> getAllHoiday();

    void deleteHoliday(Long holidayId);
}

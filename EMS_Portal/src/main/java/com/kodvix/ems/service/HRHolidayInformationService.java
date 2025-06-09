package com.kodvix.ems.service;

import com.kodvix.ems.dto.HRHolidayInformationDto;

import java.util.List;

public interface HRHolidayInformationService {

    HRHolidayInformationDto createHoliday(HRHolidayInformationDto holiday);

    List<HRHolidayInformationDto> getAllHoiday();

    void deleteHoliday(Long holidayId);
}

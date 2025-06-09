package com.kodvix.ems.service;

import com.kodvix.ems.dto.HRHolidayInformationDto;
import com.kodvix.ems.entity.HRHolidayInformationDao;
import com.kodvix.ems.repository.HRHolidayInformationRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HRHolidayInformationServiceImpl implements HRHolidayInformationService {

    @Autowired
    private HRHolidayInformationRepository holidayRepo;

    @Autowired
    private ModelMapper modelMapper;

    public HRHolidayInformationDto createHoliday(HRHolidayInformationDto holiday) {
        return convertToDto(holidayRepo.save(convertToDao(holiday)));
    }

    public List<HRHolidayInformationDto> getAllHoiday() {
        return convertToDtoList(holidayRepo.findAll());
    }

    public void deleteHoliday(Long holidayId) {
        HRHolidayInformationDto hrdto = convertToDto(holidayRepo.findById(holidayId).get());
        if (hrdto == null) {
            holidayRepo.delete(convertToDao(hrdto));
        }
    }

    //Helper methods
    private HRHolidayInformationDto convertToDto(HRHolidayInformationDao holiday) {
        return modelMapper.map(holiday, HRHolidayInformationDto.class);
    }

    private List<HRHolidayInformationDto> convertToDtoList(List<HRHolidayInformationDao> holidayList) {
        return holidayList.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private HRHolidayInformationDao convertToDao(HRHolidayInformationDto eventDto) {
        return modelMapper.map(eventDto, HRHolidayInformationDao.class);
    }


}

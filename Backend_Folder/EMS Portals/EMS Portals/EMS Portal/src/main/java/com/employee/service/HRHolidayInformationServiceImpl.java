package com.employee.service;

import com.employee.dto.EventDto;
import com.employee.dto.HRHolidayInformationDto;
import com.employee.entity.EventDao;
import com.employee.entity.HRHolidayInformationDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.repository.HRHolidayInformationRepository;
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

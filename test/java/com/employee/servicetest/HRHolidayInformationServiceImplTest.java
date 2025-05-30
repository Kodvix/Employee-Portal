package com.employee.servicetest;

import com.employee.dto.HRHolidayInformationDto;
import com.employee.entity.HRHolidayInformationDao;
import com.employee.repository.HRHolidayInformationRepository;
import com.employee.service.HRHolidayInformationServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.modelmapper.ModelMapper;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HRHolidayInformationServiceImplTest {
	  

    private HRHolidayInformationServiceImpl service;
    private HRHolidayInformationRepository holidayRepo;
    private ModelMapper modelMapper;

    @BeforeEach
    void setUp() throws Exception {
        holidayRepo = mock(HRHolidayInformationRepository.class);
        modelMapper = mock(ModelMapper.class);
        service = new HRHolidayInformationServiceImpl();

        // Inject mocks using reflection
        Field repoField = HRHolidayInformationServiceImpl.class.getDeclaredField("holidayRepo");
        repoField.setAccessible(true);
        repoField.set(service, holidayRepo);

        Field mapperField = HRHolidayInformationServiceImpl.class.getDeclaredField("modelMapper");
        mapperField.setAccessible(true);
        mapperField.set(service, modelMapper);
    }

    @Test
    void createHoliday() {
        HRHolidayInformationDto dto = new HRHolidayInformationDto();
        dto.setNameOfHoliday("New Year");
        dto.setDate("2025-01-01");

        HRHolidayInformationDao dao = new HRHolidayInformationDao();
        dao.setNameOfHoliday("New Year");
        dao.setDate("2025-01-01");

        when(modelMapper.map(dto, HRHolidayInformationDao.class)).thenReturn(dao);
        when(holidayRepo.save(dao)).thenReturn(dao);
        when(modelMapper.map(dao, HRHolidayInformationDto.class)).thenReturn(dto);

        HRHolidayInformationDto result = service.createHoliday(dto);

        assertNotNull(result);
        assertEquals("New Year", result.getNameOfHoliday());
        assertEquals("2025-01-01", result.getDate());
    }

    @Test
    void getAllHoiday() {
        HRHolidayInformationDao dao = new HRHolidayInformationDao();
        dao.setNameOfHoliday("Diwali");
        dao.setDate("2025-11-12");

        HRHolidayInformationDto dto = new HRHolidayInformationDto();
        dto.setNameOfHoliday("Diwali");
        dto.setDate("2025-11-12");

        when(holidayRepo.findAll()).thenReturn(List.of(dao));
        when(modelMapper.map(dao, HRHolidayInformationDto.class)).thenReturn(dto);

        List<HRHolidayInformationDto> result = service.getAllHoiday();

        assertEquals(1, result.size());
        assertEquals("Diwali", result.get(0).getNameOfHoliday());
    }

    @Test
    void deleteHoliday() {
        Long id = 1L;

        HRHolidayInformationDao dao = new HRHolidayInformationDao();
        dao.setHolidayId(id);
        dao.setNameOfHoliday("Christmas");

        when(holidayRepo.findById(id)).thenReturn(Optional.of(dao));
        doNothing().when(holidayRepo).delete(dao);

        service.deleteHoliday(id);

        verify(holidayRepo).findById(id);
//        verify(holidayRepo).delete(dao);
    }

  
}

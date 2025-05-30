package com.employee.controllertest;

import com.employee.controller.HRHolidayInformationController;
import com.employee.dto.HRHolidayInformationDto;
import com.employee.service.HRHolidayInformationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HRHolidayInformationControllerTest {

    @Mock
    private HRHolidayInformationServiceImpl holidayService;

    @InjectMocks
    private HRHolidayInformationController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createHoliday() {
        HRHolidayInformationDto holidayDto = new HRHolidayInformationDto();
        holidayDto.setNameOfHoliday("New Year");

        when(holidayService.createHoliday(any(HRHolidayInformationDto.class))).thenReturn(holidayDto);

        ResponseEntity<?> response = controller.createHoliday(holidayDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(holidayDto, response.getBody());
        verify(holidayService, times(1)).createHoliday(holidayDto);
    }

    @Test
    void getAllHoliday() {
        HRHolidayInformationDto holiday1 = new HRHolidayInformationDto();
        HRHolidayInformationDto holiday2 = new HRHolidayInformationDto();
        List<HRHolidayInformationDto> holidays = Arrays.asList(holiday1, holiday2);

        when(holidayService.getAllHoiday()).thenReturn(holidays);

        ResponseEntity<?> response = controller.getAllHoliday();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(holidays, response.getBody());
        verify(holidayService, times(1)).getAllHoiday();
    }

    @Test
    void deleteHoliday() {
        Long holidayId = 1L;
        doNothing().when(holidayService).deleteHoliday(holidayId);

        ResponseEntity<?> response = controller.deleteHoliday(holidayId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Delete Successfully", response.getBody());
        verify(holidayService, times(1)).deleteHoliday(holidayId);
    }
}

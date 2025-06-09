package com.kodvix.ems.controller;

import com.kodvix.ems.dto.HRHolidayInformationDto;
import com.kodvix.ems.service.HRHolidayInformationServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/holiday")
@CrossOrigin
@Tag(name = "HR Holiday API")
public class HRHolidayInformationController {

    @Autowired
    private HRHolidayInformationServiceImpl holidayService;

    @Operation(summary = "Create a new Holiday")
    @PostMapping("/save")
    public ResponseEntity<?> createHoliday(@RequestBody HRHolidayInformationDto hrHoliday){
        return  ResponseEntity.ok(holidayService.createHoliday(hrHoliday));
    }
    @Operation(summary = "get All new Holiday")
    @GetMapping("/")
    public ResponseEntity<?> getAllHoliday(){
        return  ResponseEntity.ok(holidayService.getAllHoiday());
    }

    @Operation(summary = "Delete holiday By Id ")
    @DeleteMapping
    public ResponseEntity<?> deleteHoliday(Long holidayId){
        holidayService.deleteHoliday(holidayId);
        return ResponseEntity.ok("Delete Successfully");
    }
}

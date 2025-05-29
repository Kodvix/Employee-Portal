package com.employee.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Holiday")
public class HRHolidayInformationDao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long holidayId;
    private String nameOfHoliday;
    private String description;
    private String date;

}

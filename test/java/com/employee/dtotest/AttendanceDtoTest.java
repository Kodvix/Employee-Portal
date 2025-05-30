package com.employee.dtotest;

import org.junit.jupiter.api.Test;

import com.employee.dto.AttendanceDto;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;

public class AttendanceDtoTest {

    @Test
    void testGetterAndSetter() {
        AttendanceDto attendanceDto = new AttendanceDto();

        attendanceDto.setId(1L);
        attendanceDto.setEmployeeId(100L);
        attendanceDto.setDate(LocalDate.of(2025, 5, 19));
        attendanceDto.setCheckIn(LocalTime.of(9, 0));
        attendanceDto.setCheckOut(LocalTime.of(18, 0));
        attendanceDto.setStatus(true);
        attendanceDto.setRemark("Late due to traffic");

        assertThat(attendanceDto.getId()).isEqualTo(1L);
        assertThat(attendanceDto.getEmployeeId()).isEqualTo(100L);
        assertThat(attendanceDto.getDate()).isEqualTo(LocalDate.of(2025, 5, 19));
        assertThat(attendanceDto.getCheckIn()).isEqualTo(LocalTime.of(9, 0));
        assertThat(attendanceDto.getCheckOut()).isEqualTo(LocalTime.of(18, 0));
        assertThat(attendanceDto.isStatus()).isTrue();
        assertThat(attendanceDto.getRemark()).isEqualTo("Late due to traffic");
    }

    @Test
    void testEqualsAndHashCode() {
        AttendanceDto attendance1 = new AttendanceDto();
        attendance1.setId(1L);
        attendance1.setEmployeeId(100L);
        attendance1.setDate(LocalDate.of(2025, 5, 19));
        attendance1.setStatus(true);

        AttendanceDto attendance2 = new AttendanceDto();
        attendance2.setId(1L);
        attendance2.setEmployeeId(100L);
        attendance2.setDate(LocalDate.of(2025, 5, 19));
        attendance2.setStatus(true);

        assertThat(attendance1).isEqualTo(attendance2);
        assertThat(attendance1.hashCode()).isEqualTo(attendance2.hashCode());

        attendance2.setId(2L);
        assertThat(attendance1).isNotEqualTo(attendance2);
    }

    @Test
    void testToString() {
        AttendanceDto attendanceDto = new AttendanceDto();
        attendanceDto.setId(1L);
        attendanceDto.setRemark("On time");

        String toString = attendanceDto.toString();

        assertThat(toString).contains("id=1");
        assertThat(toString).contains("remark=On time");
    }
}

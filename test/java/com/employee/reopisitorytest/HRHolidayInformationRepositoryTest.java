package com.employee.reopisitorytest;

import com.employee.entity.HRHolidayInformationDao;
import com.employee.repository.HRHolidayInformationRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class HRHolidayInformationRepositoryTest {

    @Autowired
    private HRHolidayInformationRepository hrHolidayInformationRepository;

    @Test
    public void save() {
        HRHolidayInformationDao dao = new HRHolidayInformationDao();
        dao.setNameOfHoliday("Independence Day");
        dao.setDescription("National holiday");
        dao.setDate("2025-08-15");

        HRHolidayInformationDao saved = hrHolidayInformationRepository.save(dao);

        assertThat(saved).isNotNull();
        assertThat(saved.getHolidayId()).isNotNull();
        assertThat(saved.getNameOfHoliday()).isEqualTo("Independence Day");
        assertThat(saved.getDescription()).isEqualTo("National holiday");
        assertThat(saved.getDate()).isEqualTo("2025-08-15");
    }
}

package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.CompanyDao;
import com.employee.entity.ProjectDao;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CompanyDaoTest {

    @Test
    void testNoArgsConstructor() {
        CompanyDao company = new CompanyDao();
        assertNotNull(company);
    }

    @Test
    void testAllArgsConstructor() {
        ProjectDao project1 = ProjectDao.builder().id(1L).name("Project A").build();
        ProjectDao project2 = ProjectDao.builder().id(2L).name("Project B").build();

        CompanyDao company = new CompanyDao(
                1L,
                "OpenAI",
                "123 AI Street",
                "1234567890",
                "contact@openai.com",
                "https://openai.com",
                List.of(project1, project2)
        );

        assertAll(
                () -> assertEquals(1L, company.getId()),
                () -> assertEquals("OpenAI", company.getName()),
                () -> assertEquals("123 AI Street", company.getAddress()),
                () -> assertEquals("1234567890", company.getPhoneNumber()),
                () -> assertEquals("contact@openai.com", company.getEmail()),
                () -> assertEquals("https://openai.com", company.getWebsiteUrl()),
                () -> assertNotNull(company.getProjects()),
                () -> assertEquals(2, company.getProjects().size())
        );
    }

    @Test
    void testBuilder() {
        CompanyDao company = CompanyDao.builder()
                .id(2L)
                .name("Test Company")
                .address("456 Test Lane")
                .phoneNumber("9876543210")
                .email("test@example.com")
                .websiteUrl("https://test.com")
                .projects(List.of())
                .build();

        assertAll(
                () -> assertEquals(2L, company.getId()),
                () -> assertEquals("Test Company", company.getName()),
                () -> assertEquals("456 Test Lane", company.getAddress()),
                () -> assertEquals("9876543210", company.getPhoneNumber()),
                () -> assertEquals("test@example.com", company.getEmail()),
                () -> assertEquals("https://test.com", company.getWebsiteUrl()),
                () -> assertNotNull(company.getProjects())
        );
    }
}

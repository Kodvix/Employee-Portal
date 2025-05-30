package com.employee.controllertest;

import com.employee.controller.CompanyController;
import com.employee.dto.CompanyDto;
import com.employee.service.CompanyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CompanyControllerTest {

    @Mock
    private CompanyService companyService;

    @InjectMocks
    private CompanyController companyController;

    private CompanyDto companyDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        companyDto = new CompanyDto();
        companyDto.setId(1L);
        companyDto.setName("Test Company");
        companyDto.setAddress("123 Test St");
    }

    @Test
    void createCompany() {
        when(companyService.createCompany(companyDto)).thenReturn(companyDto);

        CompanyDto result = companyController.createCompany(companyDto);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Test Company");
        verify(companyService, times(1)).createCompany(companyDto);
    }

    @Test
    void getAllCompanies() {
        List<CompanyDto> companies = List.of(companyDto);
        when(companyService.getAllCompanies()).thenReturn(companies);

        List<CompanyDto> result = companyController.getAllCompanies();

        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getName()).isEqualTo("Test Company");
        verify(companyService, times(1)).getAllCompanies();
    }

    @Test
    void getCompanyById() {
        when(companyService.getById(1L)).thenReturn(companyDto);

        CompanyDto result = companyController.getCompanyById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(companyService, times(1)).getById(1L);
    }

    @Test
    void updateCompany() {
        when(companyService.update(1L, companyDto)).thenReturn(companyDto);

        CompanyDto result = companyController.updateCompany(1L, companyDto);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(companyService, times(1)).update(1L, companyDto);
    }

    @Test
    void deleteCompany() {
        doNothing().when(companyService).delete(1L);

        ResponseEntity<String> response = companyController.deleteCompany(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Company deleted successfully");
        verify(companyService, times(1)).delete(1L);
    }
}

package com.employee.servicetest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.employee.dto.CompanyDto;
import com.employee.dto.ProjectDto;
import com.employee.entity.CompanyDao;
import com.employee.entity.ProjectDao;
import com.employee.exception.ResourceNotFoundException;
import com.employee.mapper.CompanyMapper;
import com.employee.mapper.ProjectMapper;
import com.employee.repository.CompanyRepository;
import com.employee.repository.ProjectRepository;
import com.employee.service.CompanyServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

class CompanyServiceImplTest {

    @Mock
    private CompanyRepository repo;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private CompanyServiceImpl service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createCompany() {
        CompanyDto inputDto = new CompanyDto();
        inputDto.setName("Test Company");

        CompanyDao savedDao = new CompanyDao();
        savedDao.setId(1L);
        savedDao.setName(inputDto.getName());

        // Mocking mapper static methods (using spy for partial mock)
        try (MockedStatic<CompanyMapper> mockMapper = Mockito.mockStatic(CompanyMapper.class)) {
            mockMapper.when(() -> CompanyMapper.toEntity(inputDto)).thenReturn(savedDao);
            mockMapper.when(() -> CompanyMapper.toDTO(savedDao)).thenReturn(inputDto);

            when(repo.save(savedDao)).thenReturn(savedDao);

            CompanyDto result = service.createCompany(inputDto);

            assertNotNull(result);
            assertEquals(inputDto.getName(), result.getName());

            verify(repo).save(savedDao);
        }
    }

    @Test
    void getAllCompanies() {
        CompanyDao dao1 = new CompanyDao();
        dao1.setId(1L);
        dao1.setName("Company1");

        CompanyDao dao2 = new CompanyDao();
        dao2.setId(2L);
        dao2.setName("Company2");

        List<CompanyDao> daos = List.of(dao1, dao2);

        try (MockedStatic<CompanyMapper> mockMapper = Mockito.mockStatic(CompanyMapper.class)) {
            when(repo.findAll()).thenReturn(daos);
            mockMapper.when(() -> CompanyMapper.toDTO(dao1)).thenReturn(new CompanyDto(){{
                setId(1L); setName("Company1");
            }});
            mockMapper.when(() -> CompanyMapper.toDTO(dao2)).thenReturn(new CompanyDto(){{
                setId(2L); setName("Company2");
            }});

            List<CompanyDto> result = service.getAllCompanies();

            assertEquals(2, result.size());
            verify(repo).findAll();
        }
    }

    @Test
    void getById() {
        Long id = 1L;
        CompanyDao dao = new CompanyDao();
        dao.setId(id);
        dao.setName("Company");

        CompanyDto dto = new CompanyDto();
        dto.setId(id);
        dto.setName("Company");

        when(repo.findById(id)).thenReturn(Optional.of(dao));

        try (MockedStatic<CompanyMapper> mockMapper = Mockito.mockStatic(CompanyMapper.class)) {
            mockMapper.when(() -> CompanyMapper.toDTO(dao)).thenReturn(dto);

            CompanyDto result = service.getById(id);

            assertNotNull(result);
            assertEquals(id, result.getId());
            verify(repo).findById(id);
        }
    }

   

    @Test
    void update() {
        Long id = 1L;

        CompanyDao existingDao = new CompanyDao();
        existingDao.setId(id);
        existingDao.setName("OldName");

        CompanyDto updateDto = new CompanyDto();
        updateDto.setName("NewName");
        updateDto.setAddress("New Address");
        updateDto.setPhoneNumber("1234567890");
        updateDto.setEmail("new@example.com");
        updateDto.setWebsiteUrl("https://newwebsite.com");

        CompanyDao savedDao = new CompanyDao();
        savedDao.setId(id);
        savedDao.setName(updateDto.getName());
        savedDao.setAddress(updateDto.getAddress());
        savedDao.setPhoneNumber(updateDto.getPhoneNumber());
        savedDao.setEmail(updateDto.getEmail());
        savedDao.setWebsiteUrl(updateDto.getWebsiteUrl());

        when(repo.findById(id)).thenReturn(Optional.of(existingDao));
        when(repo.save(existingDao)).thenReturn(savedDao);

        try (MockedStatic<CompanyMapper> mockMapper = Mockito.mockStatic(CompanyMapper.class)) {
            mockMapper.when(() -> CompanyMapper.toDTO(savedDao)).thenReturn(updateDto);

            CompanyDto result = service.update(id, updateDto);

            assertNotNull(result);
            assertEquals(updateDto.getName(), result.getName());
            verify(repo).findById(id);
            verify(repo).save(existingDao);
        }
    }



    @Test
    void delete() {
        Long id = 1L;
        CompanyDao dao = new CompanyDao();
        dao.setId(id);

        when(repo.findById(id)).thenReturn(Optional.of(dao));

        service.delete(id);

        verify(repo).findById(id);
        verify(repo).delete(dao);
    }

   

    @Test
    void getFullCompanyById() {
        Long id = 1L;
        CompanyDao companyDao = new CompanyDao();
        companyDao.setId(id);
        companyDao.setName("Company");

        ProjectDao project1 = new ProjectDao();
        project1.setId(101L);
        project1.setName("Project1");

        ProjectDao project2 = new ProjectDao();
        project2.setId(102L);
        project2.setName("Project2");

        List<ProjectDao> projects = List.of(project1, project2);
        companyDao.setProjects(projects);
        CompanyDto companyDto = new CompanyDto();
        companyDto.setId(id);
        companyDto.setName("Company");

        ProjectDto projectDto1 = new ProjectDto();
        projectDto1.setId(101L);
        projectDto1.setName("Project1");

        ProjectDto projectDto2 = new ProjectDto();
        projectDto2.setId(102L);
        projectDto2.setName("Project2");

        try (MockedStatic<CompanyMapper> companyMapperMock = Mockito.mockStatic(CompanyMapper.class);
             MockedStatic<ProjectMapper> projectMapperMock = Mockito.mockStatic(ProjectMapper.class)) {

            when(repo.findById(id)).thenReturn(Optional.of(companyDao));

            companyMapperMock.when(() -> CompanyMapper.toDTO(companyDao)).thenReturn(companyDto);
            projectMapperMock.when(() -> ProjectMapper.toDTO(project1)).thenReturn(projectDto1);
            projectMapperMock.when(() -> ProjectMapper.toDTO(project2)).thenReturn(projectDto2);

            CompanyDto result = service.getFullCompanyById(id);

            assertNotNull(result);
            assertEquals(id, result.getId());
            assertEquals(2, result.getProjects().size());
            verify(repo).findById(id);
        }
    }

  
}

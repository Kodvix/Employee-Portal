package com.employee.reopisitorytest;

import com.employee.entity.UserDao;
import com.employee.repository.AdminRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminRepositoryTest {

    @Mock
    private AdminRepository adminRepository;

    private UserDao user;

    @BeforeEach
    void setUp() {
        user = UserDao.builder()
                .id(1L)
                .email("admin@example.com")
                // add other fields if needed
                .build();
    }

    @Test
    public void testFindByEmail_Found() {
        when(adminRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));

        Optional<UserDao> foundUser = adminRepository.findByEmail("admin@example.com");

        assertTrue(foundUser.isPresent());
        assertEquals("admin@example.com", foundUser.get().getEmail());

        verify(adminRepository, times(1)).findByEmail("admin@example.com");
    }

}

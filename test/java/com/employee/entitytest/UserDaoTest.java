package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.Role;
import com.employee.entity.UserDao;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UserDaoTest {

    @Test
    void testBuilderAndGetters() {
        LocalDateTime now = LocalDateTime.now();

        UserDao user = UserDao.builder()
                .id(1L)
                .email("test@example.com")
                .password("securePass123")
                .otp("123456")
                .otpRequestedTime(now)
                .isOtpVerified(true)
                .role(Role.ADMIN)
                .build();

        assertEquals(1L, user.getId());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("securePass123", user.getPassword());
        assertEquals("123456", user.getOtp());
        assertEquals(now, user.getOtpRequestedTime());
        assertTrue(user.getIsOtpVerified());
        assertEquals(Role.ADMIN, user.getRole());
    }

    @Test
    void testSetters() {
        UserDao user = new UserDao();

        LocalDateTime otpTime = LocalDateTime.now();
        user.setId(2L);
        user.setEmail("user2@example.com");
        user.setPassword("pass2");
        user.setOtp("654321");
        user.setOtpRequestedTime(otpTime);
        user.setIsOtpVerified(false);
        user.setRole(Role.EMPLOYEE);

        assertEquals(2L, user.getId());
        assertEquals("user2@example.com", user.getEmail());
        assertEquals("pass2", user.getPassword());
        assertEquals("654321", user.getOtp());
        assertEquals(otpTime, user.getOtpRequestedTime());
        assertFalse(user.getIsOtpVerified());
        assertEquals(Role.EMPLOYEE, user.getRole());
    }
}

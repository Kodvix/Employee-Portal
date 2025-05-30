package com.employee.controllertest;

import com.employee.controller.AuthController;
import com.employee.dto.*;
import com.employee.entity.Role;
import com.employee.entity.UserDao;
import com.employee.exception.*;
import com.employee.repository.AdminRepository;
import com.employee.repository.EmployeeRepository;
import com.employee.response.LoginResponse;
import com.employee.service.EmailServiceImpl;
import com.employee.service.JwtService;
import com.employee.util.OtpData;
import com.employee.util.OtpStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private AdminRepository adminRepository;
    @Mock
    private EmployeeRepository employeeRepository;
    @Mock
    private JwtService jwtService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private EmailServiceImpl emailService;
    @Mock
    private OtpStore otpStore;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register() {
        RegisterRequestDto request = new RegisterRequestDto("test@example.com", "pass", Role.ADMIN);
        when(adminRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        String encodedPassword = "encodedPass";
        when(passwordEncoder.encode(request.getPassword())).thenReturn(encodedPassword);

        String result = authController.register(request);
        assertEquals("ADMIN registered successfully", result);
        verify(adminRepository, times(1)).save(any(UserDao.class));
    }

    @Test
    void login() {
        LoginRequestDto request = new LoginRequestDto("test@example.com", "password");
        UserDao user = new UserDao();
        user.setEmail(request.getEmail());
        user.setPassword("encodedPass");
        user.setRole(Role.ADMIN);

        when(adminRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPassword())).thenReturn(true);
        when(jwtService.generateToken(user.getEmail(), user.getRole())).thenReturn("jwt-token");

        ResponseEntity<LoginResponse> response = authController.login(request);
        assertEquals("jwt-token", response.getBody().getToken());
    }

    @Test
    void forgotPassword() {
        ForgotPasswordRequestDto request = new ForgotPasswordRequestDto("test@example.com", "test@example.com");
        UserDao user = new UserDao();
        user.setEmail(request.getEmail());

        when(adminRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));

        String result = authController.forgotPassword(request);
        assertEquals("OTP sent to email", result);
        verify(emailService).sendOtp(eq(request.getEmail()), anyString());
    }

    @Test
    void verifyOtp() {
        OtpRequestDto request = new OtpRequestDto("test@example.com", "123456");
        UserDao user = new UserDao();
        user.setEmail(request.getEmail());

        OtpData otpData = new OtpData("123456", LocalDateTime.now());

        when(adminRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(otpStore.getOtpData(request.getEmail())).thenReturn(otpData);

        String result = authController.verifyOtp(request);
        assertEquals("OTP verified successfully", result);
        verify(adminRepository).save(user);
    }

    @Test
    void resendOtp() {
        ResendOtpRequestDto request = new ResendOtpRequestDto("test@example.com");
        UserDao user = new UserDao();
        user.setEmail(request.getEmail());

        OtpData oldOtpData = new OtpData("111111", LocalDateTime.now().minusMinutes(6));

        when(adminRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(otpStore.getOtpData(request.getEmail())).thenReturn(oldOtpData);

        String result = authController.resendOtp(request);
        assertEquals("New OTP sent to email", result);
        verify(emailService).sendOtp(eq(user.getEmail()), anyString());
    }

    @Test
    void resetPassword() {
        PasswordResetRequestDto request = new PasswordResetRequestDto("test@example.com", "newPass", "newPass");
        UserDao user = new UserDao();
        user.setEmail(request.getEmail());
        user.setIsOtpVerified(true);

        when(adminRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(request.getNewPassword())).thenReturn("encodedNewPass");

        String result = authController.resetPassword(request);
        assertEquals("Password reset successful", result);
        verify(adminRepository).save(user);
    }
}

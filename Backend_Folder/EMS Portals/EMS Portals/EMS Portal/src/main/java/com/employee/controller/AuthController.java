package com.employee.controller;

import com.employee.dto.*;
import com.employee.entity.UserDao;
import com.employee.exception.*;
import com.employee.repository.AdminRepository;
import com.employee.repository.EmployeeRepository;
import com.employee.response.LoginResponse;
import com.employee.service.EmailServiceImpl;
import com.employee.service.JwtService;

import com.employee.util.OtpData;
import com.employee.util.OtpStore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth API")
public class AuthController {

    private final AdminRepository adminRepository;

    private final EmployeeRepository employeeRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final EmailServiceImpl emailService;
    private final OtpStore otpStore;

    // REGISTER ENDPOINT
    @Operation(summary = "Register a new user with email, password, and role")
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequestDto request) {
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        UserDao user = new UserDao();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        adminRepository.save(user);

        return request.getRole().name() + " registered successfully";
    }

    // LOGIN ENDPOINT
    @Operation(summary = "Authenticate user and return JWT token")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequestDto request) {
        UserDao user = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Email not registered. Please register first."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new PasswordMismatchException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        Long empId = employeeRepository.findByEmail(user.getEmail())
                .map(emp -> emp.getId())
                .orElse(null);
        return ResponseEntity.ok(new LoginResponse(token, user.getRole(),empId));
//        return new LoginResponseDto(token, user.getRole());
    }

    // FORGOT PASSWORD - SEND OTP
    @Operation(summary = "Send OTP to registered email for password reset")
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordRequestDto request) {
        if (!request.getEmail().equals(request.getRepeatEmail())) {
            throw new PasswordMismatchException("Emails do not match");
        }

        UserDao user = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.storeOtp(request.getEmail(), otp);
        emailService.sendOtp(user.getEmail(), otp);

        return "OTP sent to email";
    }

    // VERIFY OTP
    @Operation(summary = "Verify the OTP sent to email")
    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody OtpRequestDto request) {
        UserDao user = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        OtpData data = otpStore.getOtpData(request.getEmail());
        if (data == null || !data.getOtp().equals(request.getOtp())) {
            throw new InvalidOtpException("Invalid OTP");
        }

        if (Duration.between(data.getRequestedTime(), LocalDateTime.now()).toMinutes() > 5) {
            throw new OtpExpiredException("OTP expired");
        }

        user.setIsOtpVerified(true);
        adminRepository.save(user);
        otpStore.removeOtp(request.getEmail());

        return "OTP verified successfully";
    }

    // RESEND OTP
    @Operation(summary = "Resend a new OTP to email if allowed")
    @PostMapping("/resend-otp")
    public String resendOtp(@RequestBody ResendOtpRequestDto request) {
        UserDao user = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        OtpData existingOtp = otpStore.getOtpData(request.getEmail());
        if (existingOtp != null) {
            long minutes = Duration.between(existingOtp.getRequestedTime(), LocalDateTime.now()).toMinutes();
            if (minutes < 5) {
                throw new InvalidOtpException("Please wait " + (5 - minutes) + " minute(s) before requesting a new OTP.");
            }
        }

        String newOtp = String.format("%06d", new Random().nextInt(999999));
        otpStore.storeOtp(request.getEmail(), newOtp);
        user.setIsOtpVerified(false);
        adminRepository.save(user);
        emailService.sendOtp(user.getEmail(), newOtp);

        return "New OTP sent to email";
    }

    //RESET PASSWORD
    @Operation(summary = "Reset password after OTP verification")
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody PasswordResetRequestDto request) {
        UserDao user = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        if (!Boolean.TRUE.equals(user.getIsOtpVerified())) {
            throw new InvalidOtpException("Please verify OTP first");
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new PasswordMismatchException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setIsOtpVerified(false);
        user.setOtp(null);
        user.setOtpRequestedTime(null);
        adminRepository.save(user);

        return "Password reset successful";
    }

}
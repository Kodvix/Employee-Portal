package com.kodvix.ems.service;

public interface EmailService {
    void sendOtp(String toEmail, String otp);
}

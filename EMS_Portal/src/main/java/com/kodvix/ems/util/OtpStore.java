package com.kodvix.ems.util;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OtpStore {
    private final Map<String, OtpData> otpMap = new ConcurrentHashMap<>();

    public void storeOtp(String email, String otp) {
        otpMap.put(email, new OtpData(otp, LocalDateTime.now()));
    }

    public OtpData getOtpData(String email) {
        return otpMap.get(email);
    }

    public void removeOtp(String email) {
        otpMap.remove(email);
    }
}

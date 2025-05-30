package com.employee.servicetest;

import com.employee.service.EmailServiceImpl;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Transport;
import org.junit.jupiter.api.*;
import org.mockito.MockedStatic;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class EmailServiceImplTest {

    private EmailServiceImpl emailService;

    private MockedStatic<Transport> transportMock;

    @BeforeEach
    public void setup() {
        emailService = new EmailServiceImpl();

        // Set private fields via reflection (since @Value is not processed in tests)
        setField(emailService, "senderEmail", "sender@example.com");
        setField(emailService, "senderPassword", "password");
        setField(emailService, "smtpHost", "smtp.example.com");
        setField(emailService, "smtpPort", "587");
        setField(emailService, "smtpAuth", "true");
        setField(emailService, "starttlsEnable", "true");

        // Mock static Transport.send(Message)
        transportMock = mockStatic(Transport.class);
    }

    @AfterEach
    public void tearDown() {
        transportMock.close();
    }

    @Test
    public void sendOtp_success() {
        // Arrange
        String toEmail = "user@example.com";
        String otp = "123456";

        // Act & Assert: no exception means success
        assertDoesNotThrow(() -> emailService.sendOtp(toEmail, otp));

        // Verify Transport.send was called exactly once
        transportMock.verify(() -> Transport.send(any(Message.class)), times(1));
    }

   
    // Helper method to set private fields via reflection
    private void setField(Object target, String fieldName, Object value) {
        try {
            var field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

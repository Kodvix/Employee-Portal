package com.employee.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class UserDao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String password;

    @Transient
    private String otp;

    @Transient
    private LocalDateTime otpRequestedTime;

    @Column(name = "is_otp_verified")
    private Boolean isOtpVerified = false;

    @Enumerated(EnumType.STRING)
    private Role role;

}

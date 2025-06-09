package com.kodvix.ems.service;

import com.kodvix.ems.entity.Role;

public interface JwtService {

    String generateToken(String email, Role role);

    String extractEmail(String token);

    String extractRole(String token);

    boolean validateToken(String token);
}

package com.employee.service;

import com.employee.entity.Role;

public interface JwtService {

    String generateToken(String email, Role role);

    String extractEmail(String token);

    String extractRole(String token);

    boolean validateToken(String token);
}

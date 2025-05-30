package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.Role;

import static org.junit.jupiter.api.Assertions.*;

class RoleTest {

    @Test
    void testEnumValues() {
        Role[] roles = Role.values();
        assertEquals(2, roles.length);
        assertArrayEquals(new Role[]{Role.ADMIN, Role.EMPLOYEE}, roles);
    }

    @Test
    void testValueOf() {
        assertEquals(Role.ADMIN, Role.valueOf("ADMIN"));
        assertEquals(Role.EMPLOYEE, Role.valueOf("EMPLOYEE"));
    }

    @Test
    void testToString() {
        assertEquals("ADMIN", Role.ADMIN.toString());
        assertEquals("EMPLOYEE", Role.EMPLOYEE.toString());
    }
}

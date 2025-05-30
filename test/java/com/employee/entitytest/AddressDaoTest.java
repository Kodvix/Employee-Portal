package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.AddressDao;
import com.employee.entity.EmployeeDao;

import static org.junit.jupiter.api.Assertions.*;

class AddressDaoTest {

    @Test
    void testNoArgsConstructor() {
        AddressDao address = new AddressDao();
        assertNotNull(address);
    }

    @Test
    void testAllArgsConstructor() {
        EmployeeDao employee = EmployeeDao.builder().id(1L).build();

        AddressDao address = new AddressDao(
                1L,
                "123 Main St",
                "New York",
                "NY",
                "10001",
                "USA",
                employee
        );

        assertEquals(1L, address.getId());
        assertEquals("123 Main St", address.getStreet());
        assertEquals("New York", address.getCity());
        assertEquals("NY", address.getState());
        assertEquals("10001", address.getPostalCode());
        assertEquals("USA", address.getCountry());
        assertEquals(employee, address.getEmployee());
    }

    @Test
    void testBuilderPattern() {
        EmployeeDao employee = EmployeeDao.builder().id(2L).build();

        AddressDao address = AddressDao.builder()
                .id(2L)
                .street("456 Elm St")
                .city("Los Angeles")
                .state("CA")
                .postalCode("90001")
                .country("USA")
                .employee(employee)
                .build();

        assertEquals(2L, address.getId());
        assertEquals("456 Elm St", address.getStreet());
        assertEquals("Los Angeles", address.getCity());
        assertEquals("CA", address.getState());
        assertEquals("90001", address.getPostalCode());
        assertEquals("USA", address.getCountry());
        assertEquals(employee, address.getEmployee());
    }

    @Test
    void testSettersAndGetters() {
        AddressDao address = new AddressDao();
        EmployeeDao employee = new EmployeeDao();

        address.setId(3L);
        address.setStreet("789 Oak Ave");
        address.setCity("Chicago");
        address.setState("IL");
        address.setPostalCode("60601");
        address.setCountry("USA");
        address.setEmployee(employee);

        assertEquals(3L, address.getId());
        assertEquals("789 Oak Ave", address.getStreet());
        assertEquals("Chicago", address.getCity());
        assertEquals("IL", address.getState());
        assertEquals("60601", address.getPostalCode());
        assertEquals("USA", address.getCountry());
        assertEquals(employee, address.getEmployee());
    }
}

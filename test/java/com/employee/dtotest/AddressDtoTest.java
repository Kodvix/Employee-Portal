package com.employee.dtotest;

import org.junit.jupiter.api.Test;

import com.employee.dto.AddressDto;

import static org.assertj.core.api.Assertions.assertThat;

public class AddressDtoTest {

    @Test
    void testGetterAndSetter() {
        AddressDto addressDto = new AddressDto();

        addressDto.setId(1L);
        addressDto.setStreet("123 Main St");
        addressDto.setCity("Indore");
        addressDto.setState("MP");
        addressDto.setPostalCode("10001");
        addressDto.setCountry("India");
        addressDto.setEmployeeId(10L);

        assertThat(addressDto.getId()).isEqualTo(1L);
        assertThat(addressDto.getStreet()).isEqualTo("123 Main St");
        assertThat(addressDto.getCity()).isEqualTo("Indore");
        assertThat(addressDto.getState()).isEqualTo("MP");
        assertThat(addressDto.getPostalCode()).isEqualTo("10001");
        assertThat(addressDto.getCountry()).isEqualTo("India");
        assertThat(addressDto.getEmployeeId()).isEqualTo(10L);
    }

    @Test
    void testEqualsAndHashCode() {
        AddressDto address1 = new AddressDto();
        address1.setId(1L);
        address1.setStreet("123 Main St");

        AddressDto address2 = new AddressDto();
        address2.setId(1L);
        address2.setStreet("123 Main St");

        // Since Lombok @Data generates equals/hashCode based on fields,
        // these two objects should be equal if fields match.
        assertThat(address1).isEqualTo(address2);
        assertThat(address1.hashCode()).isEqualTo(address2.hashCode());

        address2.setId(2L);
        assertThat(address1).isNotEqualTo(address2);
    }

    @Test
    void testToString() {
        AddressDto addressDto = new AddressDto();
        addressDto.setId(1L);
        addressDto.setStreet("123 Main St");

        String toString = addressDto.toString();

        assertThat(toString).contains("id=1");
        assertThat(toString).contains("street=123 Main St");
    }
}

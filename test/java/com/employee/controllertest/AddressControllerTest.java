package com.employee.controllertest;

import com.employee.controller.AddressController;
import com.employee.dto.AddressDto;
import com.employee.exception.ResourceNotFoundException;
import com.employee.service.AddressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

public class AddressControllerTest {

    private AddressService addressService;
    private AddressController addressController;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        addressService = Mockito.mock(AddressService.class);
        addressController = new AddressController(addressService);
        mockMvc = MockMvcBuilders.standaloneSetup(addressController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void addAddress() throws Exception {
        AddressDto dto = new AddressDto();
        dto.setId(1L);
        dto.setStreet("123 Main St");
        // Set other fields as needed

        when(addressService.saveAddressForEmployee(eq(1L), any(AddressDto.class))).thenReturn(dto);

        mockMvc.perform(post("/api/addresses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.street").value("123 Main St"));

        // Test IllegalStateException returns 400
        when(addressService.saveAddressForEmployee(eq(1L), any(AddressDto.class)))
                .thenThrow(new IllegalStateException("Only one address allowed"));
        mockMvc.perform(post("/api/addresses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Only one address allowed"));

        // Test generic exception returns 500
        when(addressService.saveAddressForEmployee(eq(1L), any(AddressDto.class)))
                .thenThrow(new RuntimeException("Something went wrong"));
        mockMvc.perform(post("/api/addresses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error saving address."));
    }

    @Test
    public void getAddressByEmployee() throws Exception {
        AddressDto dto = new AddressDto();
        dto.setId(2L);
        dto.setStreet("456 Elm St");

        when(addressService.getAddressByEmployee(2L)).thenReturn(dto);

        mockMvc.perform(get("/api/addresses/employee/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.street").value("456 Elm St"));

        when(addressService.getAddressByEmployee(2L))
                .thenThrow(new ResourceNotFoundException("Address not found"));
        mockMvc.perform(get("/api/addresses/employee/2"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Address not found"));
    }

    @Test
    public void getAddressById() throws Exception {
        AddressDto dto = new AddressDto();
        dto.setId(3L);
        dto.setStreet("789 Oak St");

        when(addressService.getAddressById(3L)).thenReturn(Optional.of(dto));

        mockMvc.perform(get("/api/addresses/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3L))
                .andExpect(jsonPath("$.street").value("789 Oak St"));

        when(addressService.getAddressById(3L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/addresses/3"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Address ID not found"));
    }

    @Test
    public void updateAddress() throws Exception {
        AddressDto dto = new AddressDto();
        dto.setStreet("Updated St");

        AddressDto updatedDto = new AddressDto();
        updatedDto.setId(4L);
        updatedDto.setStreet("Updated St");

        when(addressService.updateAddressByEmployeeId(eq(4L), any(AddressDto.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/addresses/employee/4")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4L))
                .andExpect(jsonPath("$.street").value("Updated St"));

        when(addressService.updateAddressByEmployeeId(eq(4L), any(AddressDto.class)))
                .thenThrow(new ResourceNotFoundException("Address not found"));
        mockMvc.perform(put("/api/addresses/employee/4")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Address not found"));

        when(addressService.updateAddressByEmployeeId(eq(4L), any(AddressDto.class)))
                .thenThrow(new RuntimeException("Update failed"));
        mockMvc.perform(put("/api/addresses/employee/4")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Update failed"));
    }
    @Test
    public void deleteAddress() throws Exception {
        when(addressService.getAddressById(5L)).thenReturn(Optional.of(new AddressDto()));
        doNothing().when(addressService).deleteAddress(5L);

        mockMvc.perform(delete("/api/addresses/5"))
                .andExpect(status().isOk())
                .andExpect(content().string("Address deleted successfully"));

        when(addressService.getAddressById(5L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/addresses/5"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Address ID not found"));
    }

}

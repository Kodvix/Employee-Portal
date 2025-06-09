package com.kodvix.ems.controller;

import com.kodvix.ems.dto.AddressDto;
import com.kodvix.ems.exception.ResourceNotFoundException;
import com.kodvix.ems.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Tag(name = "Address API")
public class AddressController {

    private final AddressService addressService;

    @Operation(summary = "Add a new address for a specific employee (Only one allowed per employee)")
    @PostMapping("/{employeeId}")
    public ResponseEntity<?> addAddress(@PathVariable Long employeeId,
                                        @RequestBody AddressDto addressDto) {
        try {
            AddressDto saved = addressService.saveAddressForEmployee(employeeId, addressDto);
            return ResponseEntity.ok(saved);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving address.");
        }
    }

    @Operation(summary = "Get address of a specific employee")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getAddressByEmployee(@PathVariable Long employeeId) {
        try {
            AddressDto dto = addressService.getAddressByEmployee(employeeId);
            return ResponseEntity.ok(dto);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(404).body(ex.getMessage());
        }
    }

    @Operation(summary = "Get a single address by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getAddressById(@PathVariable Long id) {
        Optional<AddressDto> dto = addressService.getAddressById(id);
        if (dto.isPresent()) {
            return ResponseEntity.ok(dto.get());
        } else {
            return ResponseEntity.status(404).body("Address ID not found");
        }
    }

    @Operation(summary = "Update address of a specific employee")
    @PutMapping("/employee/{employeeId}")
    public ResponseEntity<?> updateAddress(@PathVariable Long employeeId,
                                           @RequestBody AddressDto addressDto) {
        try {
            AddressDto updated = addressService.updateAddressByEmployeeId(employeeId, addressDto);
            return ResponseEntity.ok(updated);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(404).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Update failed");
        }
    }

    @Operation(summary = "Delete an address by its ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (addressService.getAddressById(id).isPresent()) {
            addressService.deleteAddress(id);
            return ResponseEntity.ok("Address deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Address ID not found");
        }
    }
}

package com.employee.dtotest;

import jakarta.validation.*;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.employee.dto.CompanyDocumentsDto;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class CompanyDocumentsDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidCompanyDocumentsDto() {
        CompanyDocumentsDto dto = new CompanyDocumentsDto();
        dto.setId(1001L);
        dto.setEmpId(501L);
        dto.setOfferLetterDoc(new byte[]{1, 2, 3});
        dto.setLatestPaySlipDoc(new byte[]{4, 5, 6});
        dto.setDoc(new byte[]{7, 8, 9});

        Set<ConstraintViolation<CompanyDocumentsDto>> violations = validator.validate(dto);
        assertThat(violations).isEmpty();
    }

    @Test
    void testEmpIdIsNull() {
        CompanyDocumentsDto dto = new CompanyDocumentsDto();
        dto.setId(1001L);
        dto.setEmpId(null);  // invalid
        dto.setOfferLetterDoc(new byte[]{1});
        dto.setLatestPaySlipDoc(new byte[]{2});
        dto.setDoc(new byte[]{3});

        Set<ConstraintViolation<CompanyDocumentsDto>> violations = validator.validate(dto);
        assertThat(violations)
            .anyMatch(v -> v.getPropertyPath().toString().equals("empId") &&
                    v.getMessage().contains("required"));
    }
}

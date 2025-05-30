package com.employee.entitytest;

import org.junit.jupiter.api.Test;

import com.employee.entity.CompanyDocumentsDao;

import static org.junit.jupiter.api.Assertions.*;

class CompanyDocumentsDaoTest {

    @Test
    void testNoArgsConstructor() {
        CompanyDocumentsDao doc = new CompanyDocumentsDao();
        assertNotNull(doc);
    }

    @Test
    void testAllArgsConstructor() {
        byte[] offerLetter = "Offer Letter PDF".getBytes();
        byte[] paySlip = "Pay Slip PDF".getBytes();
        byte[] otherDoc = "Other Document".getBytes();

        CompanyDocumentsDao companyDoc = new CompanyDocumentsDao(
                1L,
                101L,
                offerLetter,
                paySlip,
                otherDoc
        );

        assertAll(
                () -> assertEquals(1L, companyDoc.getId()),
                () -> assertEquals(101L, companyDoc.getEmpId()),
                () -> assertArrayEquals(offerLetter, companyDoc.getOfferLetterDoc()),
                () -> assertArrayEquals(paySlip, companyDoc.getLatestPaySlipDoc()),
                () -> assertArrayEquals(otherDoc, companyDoc.getDoc())
        );
    }

    @Test
    void testSettersAndGetters() {
        CompanyDocumentsDao doc = new CompanyDocumentsDao();

        doc.setId(2L);
        doc.setEmpId(202L);
        byte[] offer = {1, 2, 3};
        byte[] payslip = {4, 5, 6};
        byte[] genericDoc = {7, 8, 9};

        doc.setOfferLetterDoc(offer);
        doc.setLatestPaySlipDoc(payslip);
        doc.setDoc(genericDoc);

        assertAll(
                () -> assertEquals(2L, doc.getId()),
                () -> assertEquals(202L, doc.getEmpId()),
                () -> assertArrayEquals(offer, doc.getOfferLetterDoc()),
                () -> assertArrayEquals(payslip, doc.getLatestPaySlipDoc()),
                () -> assertArrayEquals(genericDoc, doc.getDoc())
        );
    }
}

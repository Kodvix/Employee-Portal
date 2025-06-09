package com.kodvix.ems.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Company_Documents")
public class CompanyDocumentsDao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long empId;

    @Lob
    @Column(name = "offer_letter_doc", columnDefinition = "LONGBLOB")
    private byte[] offerLetterDoc;

    @Lob
    @Column(name = "latest_pay_slip_doc", columnDefinition = "LONGBLOB")
    private byte[] latestPaySlipDoc;

    @Lob
    @Column(name = "document", columnDefinition = "LONGBLOB")
    private byte[] doc;
}

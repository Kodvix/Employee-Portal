package com.kodvix.ems.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "leave_request")
public class LeaveDao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private EmployeeDao employee;

    private String leaveType;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;

    private String status; // e.g. Pending, Approved, Rejected

    @Lob
    @Column(name = "document", columnDefinition = "LONGBLOB")
    private byte[] leaveDoc;
}
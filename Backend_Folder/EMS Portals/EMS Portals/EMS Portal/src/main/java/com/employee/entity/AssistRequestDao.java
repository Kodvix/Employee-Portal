package com.employee.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "assist_requests")
@Data
public class AssistRequestDao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String justification;

    @Column(name = "needed_by_date", nullable = false)
    private LocalDate neededByDate;

}

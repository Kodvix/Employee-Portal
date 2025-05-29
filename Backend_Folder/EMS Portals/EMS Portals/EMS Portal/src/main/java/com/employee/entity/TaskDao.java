package com.employee.entity;

import java.time.LocalDateTime;

import com.employee.dto.Priority;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "task")
public class TaskDao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private LocalDateTime dueDate;
    private String assignedTo;
    private LocalDateTime completedAt;
    private String progress;
    private Long empId;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference
    private ProjectDao project;
}


package com.kodvix.ems.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hr_complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HRComplaintDao {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String type;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String description;

	@Lob
	private byte[] hrdoc;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id", nullable = false)
	private EmployeeDao employee;

	@Column(nullable = false)
	private LocalDateTime submittedDate;

	@Column(nullable = false)
	private String status; // e.g., "Pending", "Reviewed", "Resolved"
}

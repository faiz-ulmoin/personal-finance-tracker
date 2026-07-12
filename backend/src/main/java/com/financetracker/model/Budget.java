package com.financetracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "budgets")
@Data
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private Double monthlyLimit;
    private String month;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

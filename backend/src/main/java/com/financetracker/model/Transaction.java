package com.financetracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private String category;
    private Double amount;
    private LocalDate date;
    private String note;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

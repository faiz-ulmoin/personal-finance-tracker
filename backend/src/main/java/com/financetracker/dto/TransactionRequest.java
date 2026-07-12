package com.financetracker.dto;

import com.financetracker.model.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TransactionRequest {
    @NotNull
    private TransactionType type;

    @NotNull
    private String category;

    @NotNull @Positive
    private Double amount;

    @NotNull
    private LocalDate date;

    private String note;
}

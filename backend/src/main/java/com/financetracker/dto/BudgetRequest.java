package com.financetracker.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BudgetRequest {
    @NotNull
    private String category;

    @NotNull @Positive
    private Double monthlyLimit;

    @NotNull
    private String month;
}

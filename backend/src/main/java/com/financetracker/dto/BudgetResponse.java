package com.financetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BudgetResponse {
    private Long id;
    private String category;
    private Double monthlyLimit;
    private String month;
    private Double spent;
}

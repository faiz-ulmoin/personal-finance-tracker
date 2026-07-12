package com.financetracker.service;

import com.financetracker.dto.BudgetRequest;
import com.financetracker.dto.BudgetResponse;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.model.Budget;
import com.financetracker.model.Transaction;
import com.financetracker.model.TransactionType;
import com.financetracker.repository.BudgetRepository;
import com.financetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    public List<BudgetResponse> getAll(String month) {
        Long userId = transactionService.currentUser().getId();
        YearMonth ym = YearMonth.parse(month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        return budgetRepository.findByUserIdAndMonth(userId, month).stream()
                .map(b -> {
                    List<Transaction> spentTx = transactionRepository
                            .findByUserIdAndTypeAndCategoryAndDateBetween(userId, TransactionType.EXPENSE, b.getCategory(), start, end);
                    double spent = spentTx.stream().mapToDouble(Transaction::getAmount).sum();
                    return new BudgetResponse(b.getId(), b.getCategory(), b.getMonthlyLimit(), b.getMonth(), spent);
                })
                .collect(Collectors.toList());
    }

    public Budget create(BudgetRequest request) {
        Budget budget = new Budget();
        budget.setCategory(request.getCategory());
        budget.setMonthlyLimit(request.getMonthlyLimit());
        budget.setMonth(request.getMonth());
        budget.setUser(transactionService.currentUser());
        return budgetRepository.save(budget);
    }

    public Budget update(Long id, BudgetRequest request) {
        Budget budget = getOwned(id);
        budget.setCategory(request.getCategory());
        budget.setMonthlyLimit(request.getMonthlyLimit());
        budget.setMonth(request.getMonth());
        return budgetRepository.save(budget);
    }

    public void delete(Long id) {
        budgetRepository.delete(getOwned(id));
    }

    private Budget getOwned(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        if (!budget.getUser().getId().equals(transactionService.currentUser().getId())) {
            throw new ResourceNotFoundException("Budget not found");
        }
        return budget;
    }
}

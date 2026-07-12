package com.financetracker.service;

import com.financetracker.dto.TransactionRequest;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.model.Transaction;
import com.financetracker.model.User;
import com.financetracker.repository.TransactionRepository;
import com.financetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<Transaction> getAll() {
        return transactionRepository.findByUserIdOrderByDateDesc(currentUser().getId());
    }

    public Transaction create(TransactionRequest request) {
        Transaction tx = new Transaction();
        mapRequest(tx, request);
        tx.setUser(currentUser());
        return transactionRepository.save(tx);
    }

    public Transaction update(Long id, TransactionRequest request) {
        Transaction tx = getOwned(id);
        mapRequest(tx, request);
        return transactionRepository.save(tx);
    }

    public void delete(Long id) {
        Transaction tx = getOwned(id);
        transactionRepository.delete(tx);
    }

    private Transaction getOwned(Long id) {
        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        if (!tx.getUser().getId().equals(currentUser().getId())) {
            throw new ResourceNotFoundException("Transaction not found");
        }
        return tx;
    }

    private void mapRequest(Transaction tx, TransactionRequest request) {
        tx.setType(request.getType());
        tx.setCategory(request.getCategory());
        tx.setAmount(request.getAmount());
        tx.setDate(request.getDate());
        tx.setNote(request.getNote());
    }
}

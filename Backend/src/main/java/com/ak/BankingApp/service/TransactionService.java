package com.ak.BankingApp.service;

import com.ak.BankingApp.entity.Transaction;

import java.util.List;

public interface TransactionService {
    Transaction createTransaction(String token, Transaction transaction);
    List<Transaction> getAllTransaction(String token);
    Transaction getTransactionById(String token, Long id);
}

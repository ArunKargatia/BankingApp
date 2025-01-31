package com.ak.BankingApp.repository;

import com.ak.BankingApp.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}

package com.ak.BankingApp.repository;

import com.ak.BankingApp.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderAccountNumberInOrReceiverAccountNumberIn(List<String> senderAccountNumbers, List<String> receiverAccountNumbers);

}
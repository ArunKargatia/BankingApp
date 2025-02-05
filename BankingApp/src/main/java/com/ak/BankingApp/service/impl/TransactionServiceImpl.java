package com.ak.BankingApp.service.impl;

import com.ak.BankingApp.entity.Account;
import com.ak.BankingApp.entity.Transaction;
import com.ak.BankingApp.repository.AccountRepository;
import com.ak.BankingApp.repository.TransactionRepository;
import com.ak.BankingApp.service.JWTService;
import com.ak.BankingApp.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private JWTService jwtService;

    @Override
    public Transaction createTransaction(String token, Transaction transaction) {
        Long customerId = jwtService.extractCustomerId(token);

        Account sender = accountRepository.findByAccountNumber(transaction.getSenderAccountNumber())
                .orElseThrow(() -> new RuntimeException("Sender account not found."));

        if (!sender.getCustomer().getId().equals(customerId)){
            throw new RuntimeException("Unauthorized transaction: Sender account does not belong to you.");
        }

        Account receiver = accountRepository.findByAccountNumber(transaction.getReceiverAccountNumber())
                .orElseThrow(() -> new RuntimeException("Receiver account not found."));

        if (sender.getBalance().compareTo(transaction.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance.");
        }

        sender.setBalance(sender.getBalance().subtract(transaction.getAmount()));
        receiver.setBalance(receiver.getBalance().add(transaction.getAmount()));
        transaction.setSenderAccount(sender);
        transaction.setReceiverAccount(receiver);

        accountRepository.save(sender);
        accountRepository.save(receiver);
        transactionRepository.save(transaction);

        return transaction;
    }

    @Override
    public List<Transaction> getAllTransaction(String token) {
        Long customerId = jwtService.extractCustomerId(token);

        List<Account> accounts = accountRepository.findByCustomerId(customerId);
        List<String> accountNumbers = new ArrayList<>();
        accounts.forEach(account -> accountNumbers.add(account.getAccountNumber()));

        return transactionRepository.findBySenderAccountNumberInOrReceiverAccountNumberIn(accountNumbers, accountNumbers);
    }

    @Override
    public Transaction getTransactionById(String token, Long id) {
        Long customerId = jwtService.extractCustomerId(token);

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found."));

        if (!isCustomerInTransaction(transaction, customerId)){
            throw new RuntimeException("Unauthorized: You are not part of this transaction.");
        }

        return transaction;
    }

    private boolean isCustomerInTransaction(Transaction transaction, Long customerId){
        return accountRepository.findByAccountNumber(transaction.getSenderAccountNumber())
                .map(Account :: getCustomer)
                .map(customer -> customer.getId().equals(customerId))
                .orElse(false)
                || accountRepository.findByAccountNumber(transaction.getReceiverAccountNumber())
                .map(Account :: getCustomer)
                .map(customer -> customer.getId().equals(customerId))
                .orElse(false);
    }
}

package com.ak.BankingApp.service;

import com.ak.BankingApp.entity.Account;

import java.util.List;

public interface AccountService {
    Account createAccount(Long customerId, Account account);
    List<Account> getAllAccounts(Long customerId);
    Account updateAccount(Long id, Account updatedAccount, Long customerId);
    Account getAccountById(Long id, Long customerId);
    void deleteAccount(Long id, Long customerId);
}

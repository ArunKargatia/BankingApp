package com.ak.BankingApp.service;

import com.ak.BankingApp.entity.Account;

import java.util.List;

public interface AccountService {
    Account createAccount(Long customerId, Account account);
    List<Account> getAllAccounts();
    Account updateAccount(Long id, Account updatedAccount);
    Account getAccountById(Long id);
    void deleteAccount(Long id);
}

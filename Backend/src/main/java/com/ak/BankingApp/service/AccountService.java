package com.ak.BankingApp.service;

import com.ak.BankingApp.entity.Account;

import java.util.List;

public interface AccountService {
    Account createAccount(String token, Account account);
    List<Account> getAllAccounts(String token);
    Account updateAccount(Long id, Account updatedAccount, String token);
    Account getAccountById(Long id, String token);
    void deleteAccount(Long id, String token);
}
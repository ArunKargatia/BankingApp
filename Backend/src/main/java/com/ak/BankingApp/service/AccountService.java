package com.ak.BankingApp.service;

import com.ak.BankingApp.dto.AccountDTO;

import java.util.List;

public interface AccountService {
    AccountDTO createAccount();
    List<AccountDTO> getAllAccounts();
    AccountDTO getAccountById(Long id);
    void deleteAccount(Long id);
}
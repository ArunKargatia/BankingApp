package com.ak.BankingApp.service;

import com.ak.BankingApp.dto.AccountDTO;

import java.util.List;

public interface AccountService {

    AccountDTO createAccount();
    void deleteAccount(Long id);
    List<AccountDTO> getMyAccounts();

}
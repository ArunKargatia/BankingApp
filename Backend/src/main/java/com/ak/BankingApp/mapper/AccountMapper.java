package com.ak.BankingApp.mapper;

import com.ak.BankingApp.dto.AccountDTO;
import com.ak.BankingApp.entity.Account;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AccountMapper {

    public static AccountDTO toDTO(Account account){
        if(account == null) return null;

        AccountDTO dto = new AccountDTO();
        dto.setId(account.getId());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setBalance(account.getBalance());
        dto.setCreatedAt(account.getCreatedAt());
        dto.setCustomerId(account.getCustomer().getId());
        dto.setTransactions(account.getTransactions());

        return dto;
    }

    public static Account toEntity(AccountDTO dto){
        Account account = new Account();
        account.setId(dto.getId());
        account.setAccountNumber(dto.getAccountNumber());
        account.setBalance(dto.getBalance() != null ? dto.getBalance() : BigDecimal.ZERO);
        account.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());

        return account;
    }
}

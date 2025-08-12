package com.ak.BankingApp.mapper;

import com.ak.BankingApp.dto.TransactionDTO;
import com.ak.BankingApp.entity.Transaction;

public class TransactionMapper {
    public static TransactionDTO toDTO(Transaction transaction){

        if(transaction == null) return null;

        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setAmount(transaction.getAmount());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setDescription(transaction.getDescription());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setTargetAccountId(transaction.getTargetAccountId());

        if (transaction.getAccount() != null) {
            dto.setAccountId(transaction.getAccount().getId());
        }
        return dto;
    }

    public static Transaction toEntity(TransactionDTO dto){

        if(dto == null) return null;

        Transaction transaction = new Transaction();
        transaction.setId(dto.getId());
        transaction.setAmount(dto.getAmount());
        transaction.setTransactionType(dto.getTransactionType());
        transaction.setDescription(dto.getDescription());
        transaction.setCreatedAt(dto.getCreatedAt());
        transaction.setTargetAccountId(dto.getTargetAccountId());

        return transaction;
    }
}

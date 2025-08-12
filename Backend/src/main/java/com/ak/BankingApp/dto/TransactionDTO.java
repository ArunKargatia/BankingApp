package com.ak.BankingApp.dto;

import com.ak.BankingApp.enums.TransactionType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionDTO {

    private Long id;
    private BigDecimal amount;
    private TransactionType transactionType;
    private String description;
    private LocalDateTime createdAt;
    private Long accountId;
    private Long targetAccountId;
}

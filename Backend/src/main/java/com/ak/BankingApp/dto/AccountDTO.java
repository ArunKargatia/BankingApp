package com.ak.BankingApp.dto;

import com.ak.BankingApp.entity.Transaction;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class AccountDTO {

    private Long id;
    private String accountNumber;
    private BigDecimal balance;
    private LocalDateTime createdAt;
    private Long customerId;
    List<Transaction> transactions;

}

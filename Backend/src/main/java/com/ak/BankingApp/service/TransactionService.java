package com.ak.BankingApp.service;

import com.ak.BankingApp.dto.AccountAmountDTO;
import com.ak.BankingApp.dto.TransactionDTO;
import com.ak.BankingApp.dto.TransferDTO;

import java.util.List;

public interface TransactionService {

    void createDeposit(AccountAmountDTO accountAmountDto);
    void createWithdrawal(AccountAmountDTO accountAmountDto);
    void transferFunds(TransferDTO transferDto);
    List<TransactionDTO> showMyTransactions();

}

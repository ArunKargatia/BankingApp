package com.ak.BankingApp.service;

import com.ak.BankingApp.dto.AccountDTO;
import com.ak.BankingApp.dto.CustomerDTO;
import com.ak.BankingApp.dto.TransactionDTO;

import java.util.List;

public interface AdminService {

    List<AccountDTO> getAllAccounts();
    AccountDTO getAccountById(Long id);

    List<CustomerDTO> getAllCustomers();
    CustomerDTO getCustomerById(Long id);

    List<TransactionDTO> getAllTransaction();
    TransactionDTO getTransactionById(Long id);
}

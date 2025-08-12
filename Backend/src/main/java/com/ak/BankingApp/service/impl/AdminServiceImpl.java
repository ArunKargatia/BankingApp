package com.ak.BankingApp.service.impl;

import com.ak.BankingApp.dto.AccountDTO;
import com.ak.BankingApp.dto.CustomerDTO;
import com.ak.BankingApp.dto.TransactionDTO;
import com.ak.BankingApp.entity.Account;
import com.ak.BankingApp.entity.Customer;
import com.ak.BankingApp.entity.Transaction;
import com.ak.BankingApp.mapper.AccountMapper;
import com.ak.BankingApp.mapper.CustomerMapper;
import com.ak.BankingApp.mapper.TransactionMapper;
import com.ak.BankingApp.repository.AccountRepository;
import com.ak.BankingApp.repository.CustomerRepository;
import com.ak.BankingApp.repository.TransactionRepository;
import com.ak.BankingApp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(AccountMapper::toDTO)
                .toList();
    }

    @Override
    public AccountDTO getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found with ID: " + id));
        return AccountMapper.toDTO(account);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(CustomerMapper::toDTO)
                .toList();
    }

    @Override
    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + id));

        return CustomerMapper.toDTO(customer);
    }

    @Override
    public List<TransactionDTO> getAllTransaction() {
        return transactionRepository.findAll().stream()
                .map(TransactionMapper::toDTO)
                .toList();
    }

    @Override
    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found with ID : "+ id));
        return TransactionMapper.toDTO(transaction);
    }

    private boolean isCustomerInTransaction(Transaction transaction, Long customerId){
        if (transaction.getAccount().getCustomer().getId().equals(customerId)){
            return true;
        }

        if (transaction.getTargetAccountId() != null) {
            return accountRepository.findById(transaction.getTargetAccountId())
                    .map(Account::getCustomer)
                    .map(customer -> customer.getId().equals(customerId))
                    .orElse(false);
        }

        return false;
    }
}

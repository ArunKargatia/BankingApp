package com.ak.BankingApp.service.impl;

import com.ak.BankingApp.entity.Account;
import com.ak.BankingApp.entity.Customer;
import com.ak.BankingApp.repository.AccountRepository;
import com.ak.BankingApp.repository.CustomerRepository;
import com.ak.BankingApp.service.AccountService;
import com.ak.BankingApp.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JWTService jwtService;

    @Override
    public Account createAccount(String token, Account account) {
        Long customerId = jwtService.extractCustomerId(token);
        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isPresent()){
            account.setCustomer(customer.get());
            return accountRepository.save(account);
        } else {
            throw new RuntimeException("Customer not found with Id : "+customerId);
        }
    }

    @Override
    public List<Account> getAllAccounts(String token) {
        Long customerId = jwtService.extractCustomerId(token);
        return accountRepository.findByCustomerId(customerId);
    }

    @Override
    public Account getAccountById(Long id, String token) {
        Long customerId = jwtService.extractCustomerId(token);
        Optional<Account> account = accountRepository.findById(id);
        if (account.isPresent() && account.get().getCustomer().getId().equals(customerId)){
            return account.orElse(null);
        }
        throw new RuntimeException("Account not found or now owned by customer with Id : "+customerId);
    }

    @Override
    public Account updateAccount(Long id, Account updatedAccount, String token) {
        Long customerId = jwtService.extractCustomerId(token);
        Account existingAccount = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with Id: "+ id));

        if (!existingAccount.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Unauthorized to update account ID: " + id);
        }

        existingAccount.setAccountNumber(updatedAccount.getAccountNumber());
        existingAccount.setAccountType(updatedAccount.getAccountType());
        existingAccount.setBalance(updatedAccount.getBalance());

        return accountRepository.save(existingAccount);
    }

    @Override
    public void deleteAccount(Long id, String token) {
        Long customerId = jwtService.extractCustomerId(token);
        Optional<Account> account = accountRepository.findById(id);
        if (account.isPresent() && account.get().getCustomer().getId().equals(customerId)){
            accountRepository.deleteById(id);
        } else {
            throw new RuntimeException("Account not found or now owned by customer with Id : "+customerId);
        }
    }
}

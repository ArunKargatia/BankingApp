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
    public Account createAccount(Long customerId, Account account) {
        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isPresent()){
            account.setCustomer(customer.get());
            return accountRepository.save(account);
        } else {
            throw new RuntimeException("Customer not found with Id : "+customerId);
        }
    }

    @Override
    public List<Account> getAllAccounts(Long customerId) {
        return accountRepository.findByCustomerId(customerId);
    }

    @Override
    public Account getAccountById(Long id, Long customerId) {
        Account account = accountRepository.findById(id).orElse(null);
        if (account != null && account.getCustomer().getId().equals(customerId)){
            return account;
        }
        throw new RuntimeException("Account not found or now owned by customer with Id : "+customerId);
    }

    @Override
    public Account updateAccount(Long id, Account updatedAccount, Long customerId) {
        Optional<Account> account = accountRepository.findById(id);
        if (account.isPresent() && account.get().getCustomer().getId().equals(customerId)){
            Account existingAccount = account.get();
            existingAccount.setAccountNumber(updatedAccount.getAccountNumber());
            existingAccount.setAccountType(updatedAccount.getAccountType());
            existingAccount.setBalance(updatedAccount.getBalance());

            if (updatedAccount.getCustomer() != null){
                Optional<Customer> customer = customerRepository.findById(updatedAccount.getCustomer().getId());
                customer.ifPresent(existingAccount::setCustomer);
            }
            return accountRepository.save(existingAccount);
        } else {
            return null;
        }
    }

    @Override
    public void deleteAccount(Long id, Long customerId) {
        Optional<Account> account = accountRepository.findById(id);
        if (account.isPresent() && account.get().getCustomer().getId().equals(customerId)){
            accountRepository.deleteById(id);
        } else {
            throw new RuntimeException("Account not found or now owned by customer with Id : "+customerId);
        }
    }
}

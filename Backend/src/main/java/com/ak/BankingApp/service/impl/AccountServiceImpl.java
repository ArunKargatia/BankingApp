package com.ak.BankingApp.service.impl;

import com.ak.BankingApp.config.JWTService;
import com.ak.BankingApp.dto.AccountDTO;
import com.ak.BankingApp.entity.Account;
import com.ak.BankingApp.entity.Customer;
import com.ak.BankingApp.mapper.AccountMapper;
import com.ak.BankingApp.repository.AccountRepository;
import com.ak.BankingApp.repository.CustomerRepository;
import com.ak.BankingApp.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JWTService jwtService;

    @Override
    @Transactional
    public AccountDTO createAccount() {
        String token = extractTokenFromSecurityContext();
        Long customerId = jwtService.extractCustomerId(token);

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + customerId));

        Account account = new Account();
        account.setAccountNumber(generateUniqueAccountNumber());
        account.setBalance(BigDecimal.ZERO);
        account.setCustomer(customer);

        accountRepository.save(account);
        return AccountMapper.toDTO(account);
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            accountNumber = String.valueOf(1000000000L + (long) (Math.random() * 9000000000L));
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    @Override
    public void deleteAccount(Long id) {
        String token = extractTokenFromSecurityContext();
        Long customerId = jwtService.extractCustomerId(token);

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found with ID: " + id));

        if (!account.getCustomer().getId().equals(customerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access to this account by customer ID: " + customerId);        }

        accountRepository.delete(account);
    }

    @Override
    public List<AccountDTO> getMyAccounts() {
        String token = extractTokenFromSecurityContext();
        Long customerId = jwtService.extractCustomerId(token);

        List<Account> accounts = accountRepository.findByCustomerId(customerId);

        if (accounts.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No accounts found for customer ID: " + customerId);
        }

        return accounts.stream()
                .map(AccountMapper::toDTO)
                .toList();
    }

    private String extractTokenFromSecurityContext() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No request context available.");
        }

        HttpServletRequest request = attributes.getRequest();
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing Authorization header.");        }

        return authHeader.substring(7);
    }
}
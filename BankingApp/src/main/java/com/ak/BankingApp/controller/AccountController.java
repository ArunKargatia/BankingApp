package com.ak.BankingApp.controller;

import com.ak.BankingApp.entity.Account;
import com.ak.BankingApp.service.AccountService;
import com.ak.BankingApp.service.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private JWTService jwtService;

    private Long getCustomerIdFromToken(HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        return jwtService.extractCustomerId(token);
    }

    @GetMapping
    public ResponseEntity<?> getAllAccounts(HttpServletRequest request){
        Long customerId = getCustomerIdFromToken(request);
        List<Account> allAccounts = accountService.getAllAccounts(customerId);
        return new ResponseEntity<>(allAccounts, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Account> addAccount(@RequestBody Account account, HttpServletRequest request){
        Long customerId = getCustomerIdFromToken(request);
        Account newAccount = accountService.createAccount(customerId, account);
        return new ResponseEntity<>(newAccount, HttpStatus.CREATED);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getAccountById(@PathVariable Long id, HttpServletRequest request){
        Long customerId = getCustomerIdFromToken(request);
        try {
            Account account = accountService.getAccountById(id, customerId);
            return new ResponseEntity<>(account, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/id/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody Account updatedAccount, HttpServletRequest request){
        Long customerId = getCustomerIdFromToken(request);
        try {
            Account account = accountService.updateAccount(id, updatedAccount, customerId);
            return new ResponseEntity<>(account, HttpStatus.ACCEPTED);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id, HttpServletRequest request){
        Long customerId = getCustomerIdFromToken(request);
        accountService.deleteAccount(id, customerId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

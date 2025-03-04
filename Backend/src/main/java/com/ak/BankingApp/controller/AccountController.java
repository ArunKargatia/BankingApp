package com.ak.BankingApp.controller;

import com.ak.BankingApp.entity.Account;
import com.ak.BankingApp.service.AccountService;
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

    @GetMapping
    public ResponseEntity<?> getAllAccounts(HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        List<Account> allAccounts = accountService.getAllAccounts(token);
        return new ResponseEntity<>(allAccounts, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Account> addAccount(@RequestBody Account account, HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        Account newAccount = accountService.createAccount(token, account);
        return new ResponseEntity<>(newAccount, HttpStatus.CREATED);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getAccountById(@PathVariable Long id, HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
            Account account = accountService.getAccountById(id, token);
            return new ResponseEntity<>(account, HttpStatus.OK);
    }

    @PutMapping("/id/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody Account updatedAccount, HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        Account account = accountService.updateAccount(id, updatedAccount, token);
        return new ResponseEntity<>(account, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id, HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        accountService.deleteAccount(id, token);
        return ResponseEntity.ok("Account deleted successfully.");
    }
}

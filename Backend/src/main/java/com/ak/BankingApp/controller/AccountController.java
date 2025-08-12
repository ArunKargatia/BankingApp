package com.ak.BankingApp.controller;

import com.ak.BankingApp.dto.AccountDTO;
import com.ak.BankingApp.service.AccountService;
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

    @GetMapping("/all")
    public ResponseEntity<List<AccountDTO>> getAllAccounts(){
        List<AccountDTO> allAccounts = accountService.getAllAccounts();
        return new ResponseEntity<>(allAccounts, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AccountDTO> addAccount(){
        AccountDTO newAccount = accountService.createAccount();
        return ResponseEntity.status(HttpStatus.CREATED).body(newAccount);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable Long id) {
        AccountDTO account = accountService.getAccountById(id);
        return new ResponseEntity<>(account, HttpStatus.OK);
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok("Account deleted successfully.");
    }
}
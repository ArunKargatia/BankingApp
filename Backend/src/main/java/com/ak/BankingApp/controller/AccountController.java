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

    @PostMapping
    public ResponseEntity<AccountDTO> addAccount(){
        AccountDTO newAccount = accountService.createAccount();
        return ResponseEntity.status(HttpStatus.CREATED).body(newAccount);
    }

    @GetMapping
    public ResponseEntity<List<AccountDTO>> getMyAccounts(){
        return ResponseEntity.ok(accountService.getMyAccounts());
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok("Account deleted successfully.");
    }
}
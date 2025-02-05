package com.ak.BankingApp.controller;

import com.ak.BankingApp.entity.Transaction;
import com.ak.BankingApp.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction, HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        return ResponseEntity.ok(transactionService.createTransaction(token, transaction));
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return ResponseEntity.ok(transactionService.getAllTransaction(token));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id, HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        return ResponseEntity.ok(transactionService.getTransactionById(token, id));
    }
}

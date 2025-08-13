package com.ak.BankingApp.controller;

import com.ak.BankingApp.dto.AccountAmountDTO;
import com.ak.BankingApp.dto.TransactionDTO;
import com.ak.BankingApp.dto.TransferDTO;
import com.ak.BankingApp.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllMyTransactions(){
        return ResponseEntity.ok(transactionService.showMyTransactions());
    }

    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(@Valid @RequestBody AccountAmountDTO dto){
        transactionService.createDeposit(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Deposit Successful.");
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@Valid @RequestBody AccountAmountDTO dto){
        transactionService.createWithdrawal(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Withdrawal Successful.");
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@Valid @RequestBody TransferDTO dto){
        transactionService.transferFunds(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Transfer Successful.");
    }

}

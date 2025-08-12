package com.ak.BankingApp.controller;

import com.ak.BankingApp.dto.AccountDTO;
import com.ak.BankingApp.dto.CustomerDTO;
import com.ak.BankingApp.dto.TransactionDTO;
import com.ak.BankingApp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/account/all")
    public ResponseEntity<List<AccountDTO>> getAllAccounts(){
        List<AccountDTO> allAccounts = adminService.getAllAccounts();
        return new ResponseEntity<>(allAccounts, HttpStatus.OK);
    }

    @GetMapping("/account/{id}")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable Long id) {
        AccountDTO account = adminService.getAccountById(id);
        return new ResponseEntity<>(account, HttpStatus.OK);
    }

    @GetMapping("/customer/all")
    public ResponseEntity<List<CustomerDTO>> getAllCustomer(){
        return ResponseEntity.ok(adminService.getAllCustomers());
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id){
        return ResponseEntity.ok(adminService.getCustomerById(id));
    }

    @GetMapping("/transaction/all")
    public ResponseEntity<List<TransactionDTO>> getAllTransactions(){
        return ResponseEntity.ok(adminService.getAllTransaction());
    }

    @GetMapping("/transaction/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id){
        return ResponseEntity.ok(adminService.getTransactionById(id));
    }
}

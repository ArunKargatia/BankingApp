package com.ak.BankingApp.controller;

import com.ak.BankingApp.dto.RegisterDTO;
import com.ak.BankingApp.dto.SignInDTO;
import com.ak.BankingApp.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/health-check")
    public String healthCheck(){
        return "Ok";
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterDTO dto){
        customerService.createCustomer(dto);
        return ResponseEntity.ok("Customer registered successfully.");
    }

    @PostMapping("/login")
    public String login(@Valid @RequestBody SignInDTO request){
        return customerService.verify(request);
    }
}

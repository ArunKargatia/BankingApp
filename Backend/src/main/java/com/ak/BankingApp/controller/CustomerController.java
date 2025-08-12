package com.ak.BankingApp.controller;

import com.ak.BankingApp.dto.CustomerDTO;
import com.ak.BankingApp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PutMapping("id/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Long id,
                                            @RequestBody CustomerDTO updatedCustomerDto){
        return ResponseEntity.ok(customerService.updateCustomer(id, updatedCustomerDto));
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id){
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("Customer Deleted Successfully.");
    }

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        String message = customerService.updateProfilePicture(file);
        return ResponseEntity.ok(message);
    }
}
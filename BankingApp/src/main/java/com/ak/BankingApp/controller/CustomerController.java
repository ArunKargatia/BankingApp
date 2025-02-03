package com.ak.BankingApp.controller;

import com.ak.BankingApp.entity.Customer;
import com.ak.BankingApp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity<?> getAllCustomer(){
        List<Customer> all = customerService.getAllCustomers();
        return new ResponseEntity<>(all, HttpStatus.OK);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id){
        try {
            Object customer = customerService.getCustomerById(id);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("id/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody Customer updatedCustomer){
        Customer customer = customerService.updateCustomer(id, updatedCustomer);
        return new ResponseEntity<>(customer, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id){
        customerService.deleteCustomer(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}


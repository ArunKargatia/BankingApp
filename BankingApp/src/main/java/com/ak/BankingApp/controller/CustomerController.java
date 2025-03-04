package com.ak.BankingApp.controller;

import com.ak.BankingApp.entity.Customer;
import com.ak.BankingApp.service.CloudinaryService;
import com.ak.BankingApp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    private final CloudinaryService cloudinaryService;

    public CustomerController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public ResponseEntity<?> getAllCustomer(){
        List<Customer> all = customerService.getAllCustomers();
        return new ResponseEntity<>(all, HttpStatus.OK);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id){
        try {
            Customer customer = customerService.getCustomerById(id);
            if (customer == null){
                return new ResponseEntity<>("Customer not found.", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("id/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id,
                                            @RequestBody Customer updatedCustomer){
        try {
            Customer customer = customerService.updateCustomer(id, updatedCustomer);
            return new ResponseEntity<>(customer, HttpStatus.ACCEPTED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id){
        customerService.deleteCustomer(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        Long customerId = (Long) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        Customer customer = customerService.getCustomerById(customerId);

        try {
            String oldImageUrl = customer.getProfilePicture();
            String newImageUrl = cloudinaryService.uploadImage(file);

            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                cloudinaryService.deleteImage(oldImageUrl);
            }
            customerService.updateProfilePicture(customer.getId(), newImageUrl);
            return ResponseEntity.ok("Profile picture updated successfully: "+ newImageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Image upload failed: "+ e.getMessage());
        }
    }
}


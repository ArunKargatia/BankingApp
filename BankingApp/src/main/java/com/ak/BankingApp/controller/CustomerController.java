package com.ak.BankingApp.controller;

import com.ak.BankingApp.entity.Customer;
import com.ak.BankingApp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Value("${file.upload-dir}")
    private String uploadDir;

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
    public ResponseEntity<?> updateCustomer(@PathVariable Long id,
                                            @RequestPart Customer updatedCustomer,
                                            @RequestPart MultipartFile file){
        try {
            Customer customer = customerService.updateCustomer(id, updatedCustomer);

            if (file != null && !file.isEmpty()) {
                String originalFileName = file.getOriginalFilename();
//                String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
                String fileName = id + "_" + originalFileName;

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                File destinationFile = new File(uploadDir + File.separator + fileName);
                file.transferTo(destinationFile);

                String filePath = uploadDir + File.separator + fileName;
                customer.setProfilePicture(filePath);
                customerService.updateProfilePicture(id, filePath);
            }
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
}


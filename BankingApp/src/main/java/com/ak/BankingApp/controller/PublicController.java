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

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private CustomerService customerService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping("/health-check")
    public String healthCheck(){
        return "Ok";
    }

    @PostMapping("/register")
    public ResponseEntity<Customer> register(@RequestPart("customer") Customer customer,
                                             @RequestPart("file") MultipartFile file){

        Customer newCustomer = customerService.createCustomer(customer);

        if (file != null && !file.isEmpty()) {
            try {
                String originalFileName = file.getOriginalFilename();

//                String extension = originalFileName.substring(originalFileName.lastIndexOf("."));

                String fileName = newCustomer.getId() + "_" + originalFileName;

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                File destinationFile = new File(uploadDir + File.separator + fileName);
                file.transferTo(destinationFile);

                String filePath = uploadDir + File.separator + fileName;
                newCustomer.setProfilePicture(filePath);
                customerService.updateProfilePicture(newCustomer.getId(), filePath);
            } catch (IOException e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(newCustomer, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public String login(@RequestBody Customer customer){
        return customerService.verify(customer);
    }
}

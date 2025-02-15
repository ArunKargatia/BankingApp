package com.ak.BankingApp.controller;

import com.ak.BankingApp.entity.Customer;
import com.ak.BankingApp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
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
            Customer customer = customerService.getCustomerById(id);
            if (customer == null){
                return new ResponseEntity<>("Customer not found.", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/profile_pictures/{fileName}")
    public ResponseEntity<String> getProfilePictureUrl(@PathVariable String fileName) {
        try{
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            UrlResource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()){
                return ResponseEntity.notFound().build();
            }

            String imageUrl = "http://localhost:8080/profile_pictures/" + fileName;

            return ResponseEntity.ok(imageUrl);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("id/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id,
                                            @RequestPart("updatedCustomer") Customer updatedCustomer,
                                            @RequestPart(value = "file", required = false) MultipartFile file){
        try {
            Customer customer = customerService.updateCustomer(id, updatedCustomer);

            if (file != null && !file.isEmpty()) {

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                if (customer.getProfilePicture() != null) {
                    File oldFile = new File(customer.getProfilePicture());
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }

                String fileName = id + "_" + file.getOriginalFilename();
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


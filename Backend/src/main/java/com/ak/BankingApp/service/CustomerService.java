package com.ak.BankingApp.service;

import com.ak.BankingApp.dto.CustomerDTO;
import com.ak.BankingApp.dto.RegisterDTO;
import com.ak.BankingApp.dto.SignInDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CustomerService {
    void createCustomer(RegisterDTO registerDto);
    List<CustomerDTO> getAllCustomers();
    CustomerDTO getCustomerById(Long id);
    CustomerDTO updateCustomer(Long id, CustomerDTO updatedCustomerDto);
    void deleteCustomer(Long id);
    String verify(SignInDTO request);
    String updateProfilePicture(MultipartFile file);
}

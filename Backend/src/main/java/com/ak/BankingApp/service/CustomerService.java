package com.ak.BankingApp.service;

import com.ak.BankingApp.dto.CustomerDTO;
import com.ak.BankingApp.dto.RegisterDTO;
import com.ak.BankingApp.dto.SignInDTO;
import org.springframework.web.multipart.MultipartFile;

public interface CustomerService {

    void createCustomer(RegisterDTO registerDto);
    CustomerDTO viewMyProfile();
    CustomerDTO updateCustomer(Long id, CustomerDTO updatedCustomerDto);
    void deleteCustomer(Long id);
    String verify(SignInDTO request);
    String updateProfilePicture(MultipartFile file);

}

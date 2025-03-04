package com.ak.BankingApp.service.impl;

import com.ak.BankingApp.entity.Account;
import com.ak.BankingApp.entity.Customer;
import com.ak.BankingApp.repository.AccountRepository;
import com.ak.BankingApp.repository.CustomerRepository;
import com.ak.BankingApp.service.AccountService;
import com.ak.BankingApp.service.CustomerService;
import com.ak.BankingApp.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Customer createCustomer(Customer customer) {
        if (customer.getAccounts() != null) {
            for (Account account : customer.getAccounts()) {
                account.setCustomer(customer);
            }
        }
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    @Override
    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isPresent()) {
            Customer existingCustomer = customer.get();

            if (updatedCustomer.getName() != null) existingCustomer.setName(updatedCustomer.getName());
            if (updatedCustomer.getEmail() != null) existingCustomer.setEmail(updatedCustomer.getEmail());
            if (updatedCustomer.getUserName() != null) existingCustomer.setUserName(updatedCustomer.getUserName());
            if (updatedCustomer.getPassword() != null) existingCustomer.setPassword(passwordEncoder.encode(updatedCustomer.getPassword()));
            if (updatedCustomer.getPhone() != null) existingCustomer.setPhone(updatedCustomer.getPhone());
            if (updatedCustomer.getAddress() != null) existingCustomer.setAddress(updatedCustomer.getAddress());
            if (updatedCustomer.getDateOfBirth() != null) existingCustomer.setDateOfBirth(updatedCustomer.getDateOfBirth());

            if (updatedCustomer.getAccounts() != null) {
                for (Account account : updatedCustomer.getAccounts()) {
                    account.setCustomer(existingCustomer);
                    accountRepository.save(account);
                }
            }
            return customerRepository.save(existingCustomer);
        } else {
            return null;
        }
    }

    @Override
    public void updateProfilePicture(Long id, String profilePicturePath) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isPresent()) {
            Customer existingCustomer = customer.get();
            existingCustomer.setProfilePicture(profilePicturePath);
            customerRepository.save(existingCustomer);
        }
    }

    @Override
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    @Override
    public String verify(Customer customer) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(customer.getUserName(), customer.getPassword()));
        if (authentication.isAuthenticated()) {

            Customer customerFromDB = customerRepository.findByUserName(customer.getUserName());

            if (customerFromDB != null) {
                Long customerId = customerFromDB.getId();
                return jwtService.generateToken(customer.getUserName(), customerId);
            } else {
                return "Customer not found.";
            }
        }
        return "Authentication Failed";
    }
}

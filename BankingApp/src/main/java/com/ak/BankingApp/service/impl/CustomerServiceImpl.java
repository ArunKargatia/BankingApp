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
            existingCustomer.setName(updatedCustomer.getName());
            existingCustomer.setEmail(updatedCustomer.getEmail());
            existingCustomer.setUserName(updatedCustomer.getUserName());
            existingCustomer.setPassword(passwordEncoder.encode(updatedCustomer.getPassword()));
            existingCustomer.setPhone(updatedCustomer.getPhone());

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
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    @Override
    public String verify(Customer customer) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(customer.getUserName(), customer.getPassword()));
        if (authentication.isAuthenticated()) {
            return JWTService.generateToken(customer.getUserName());
        }
        return "Fail";
    }
}

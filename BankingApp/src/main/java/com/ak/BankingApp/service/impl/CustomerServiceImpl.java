package com.ak.BankingApp.service.impl;

import com.ak.BankingApp.entity.Customer;
import com.ak.BankingApp.repository.CustomerRepository;
import com.ak.BankingApp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomer() {
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    @Override
    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isPresent()){
            Customer existingCustomer = customer.get();
            existingCustomer.setName(updatedCustomer.getName());
            existingCustomer.setEmail(updatedCustomer.getEmail());
            existingCustomer.setPhone(updatedCustomer.getPhone());
            return customerRepository.save(existingCustomer);
        } else {
            return null;
        }
    }

    @Override
    public void deleteCustomer(Long id) {
        Optional<Customer> customer = customerRepository.findById(id);
        customerRepository.deleteById(id);
    }
}


package com.ak.BankingApp.service;

import com.ak.BankingApp.entity.Customer;

import java.util.List;

public interface CustomerService {
    Customer createCustomer(Customer customer);
    List<Customer> getAllCustomers();
    Object getCustomerById(Long id);
    Customer updateCustomer(Long id, Customer updatedCustomer);
    void deleteCustomer(Long id);
    String verify(Customer customer);
}

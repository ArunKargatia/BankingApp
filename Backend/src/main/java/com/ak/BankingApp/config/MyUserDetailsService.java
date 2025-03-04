package com.ak.BankingApp.config;

import com.ak.BankingApp.entity.Customer;
import com.ak.BankingApp.entity.CustomerPrincipal;
import com.ak.BankingApp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Customer customer = customerRepository.findByUserName(username);
        if (customer == null){
            System.out.println("Customer not found");
            throw new UsernameNotFoundException("Customer not found.");
        }

        return new CustomerPrincipal(customer);
    }
}

package com.ak.BankingApp.mapper;

import com.ak.BankingApp.dto.CustomerDTO;
import com.ak.BankingApp.entity.Customer;

public class CustomerMapper {

    public static CustomerDTO toDTO(Customer customer){
        if(customer == null) return null;

        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setUserName(customer.getUserName());
        dto.setPhone(customer.getPhone());
        dto.setProfilePicture(customer.getProfilePicture());
        dto.setDateOfBirth(customer.getDateOfBirth());
        dto.setAddress(customer.getAddress());
        dto.setRole(customer.getRole());
        dto.setCreatedAt(customer.getCreatedAt());

        return dto;
    }

    public static Customer toEntity(CustomerDTO dto){
        if(dto == null) return null;

        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setUserName(dto.getUserName());
        customer.setPhone(dto.getPhone());
        customer.setProfilePicture(dto.getProfilePicture());
        customer.setDateOfBirth(dto.getDateOfBirth());
        customer.setAddress(dto.getAddress());
        customer.setCreatedAt(dto.getCreatedAt());

        return customer;
    }
}

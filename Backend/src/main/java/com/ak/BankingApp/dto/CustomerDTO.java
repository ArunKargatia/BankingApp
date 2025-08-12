package com.ak.BankingApp.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class CustomerDTO {

    private Long id;
    private String name;
    private String email;
    private String userName;
    private String phone;
    private String profilePicture;
    private LocalDate dateOfBirth;
    private String address;
    private String role;
    private LocalDateTime createdAt;

}

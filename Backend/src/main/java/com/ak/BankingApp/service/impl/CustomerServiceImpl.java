package com.ak.BankingApp.service.impl;

import com.ak.BankingApp.config.JWTService;
import com.ak.BankingApp.dto.CustomerDTO;
import com.ak.BankingApp.dto.RegisterDTO;
import com.ak.BankingApp.dto.SignInDTO;
import com.ak.BankingApp.entity.Customer;
import com.ak.BankingApp.mapper.CustomerMapper;
import com.ak.BankingApp.repository.CustomerRepository;
import com.ak.BankingApp.service.CloudinaryService;
import com.ak.BankingApp.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public void createCustomer(RegisterDTO registerDto) {
        if (customerRepository.existsByUserName(registerDto.getUserName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }

        if (customerRepository.existsByEmail(registerDto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        Customer customer = new Customer();
        customer.setName(registerDto.getName());
        customer.setEmail(registerDto.getEmail());
        customer.setUserName(registerDto.getUserName());
        customer.setPhone(registerDto.getPhone());
        customer.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        customer.setRole("USER");

        customerRepository.save(customer);
    }

    @Override
    public CustomerDTO viewMyProfile() {
        String token = extractTokenFromSecurityContext();
        Long customerId = jwtService.extractCustomerId(token);

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + customerId));

        return CustomerMapper.toDTO(customer);
    }

    @Override
    public CustomerDTO updateCustomer(Long id, CustomerDTO updatedCustomerDto) {
        Customer existingCustomer  = customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + id));

        if (updatedCustomerDto.getName() != null) existingCustomer.setName(updatedCustomerDto.getName());
        if (updatedCustomerDto.getEmail() != null) existingCustomer.setEmail(updatedCustomerDto.getEmail());
        if (updatedCustomerDto.getUserName() != null) existingCustomer.setUserName(updatedCustomerDto.getUserName());
        if (updatedCustomerDto.getPhone() != null) existingCustomer.setPhone(updatedCustomerDto.getPhone());
        if (updatedCustomerDto.getAddress() != null) existingCustomer.setAddress(updatedCustomerDto.getAddress());
        if (updatedCustomerDto.getDateOfBirth() != null) existingCustomer.setDateOfBirth(updatedCustomerDto.getDateOfBirth());

        Customer savedCustomer = customerRepository.save(existingCustomer);
        return CustomerMapper.toDTO(savedCustomer);
    }

    @Override
    public String updateProfilePicture(MultipartFile file) {
        try {
            String token = extractTokenFromSecurityContext();
            Long customerId = jwtService.extractCustomerId(token);

            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + customerId));

            String oldImageUrl = customer.getProfilePicture();
            String newImageUrl = cloudinaryService.uploadImage(file);

            if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                cloudinaryService.deleteImage(oldImageUrl);
            }

            customer.setProfilePicture(newImageUrl);
            customerRepository.save(customer);

            return "Profile picture updated successfully: " + newImageUrl;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Image upload failed: " + e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error: " + e.getMessage());
        }
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with ID: " + id));

        customerRepository.delete(customer);
    }

    @Override
    public String verify(SignInDTO request) {
        try{
            Customer customer = customerRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with username: " + request.getEmail()));

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            if (authentication.isAuthenticated()) {
                return jwtService.generateToken(customer.getId(), customer.getEmail(), customer.getRole());
            } else {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
            }
        }  catch (UsernameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Authentication error: " + e.getMessage());
        }
    }

    private String extractTokenFromSecurityContext() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attributes == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No request context available.");
        }

        HttpServletRequest request = attributes.getRequest();
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing Authorization header.");        }

        return authHeader.substring(7);
    }
}

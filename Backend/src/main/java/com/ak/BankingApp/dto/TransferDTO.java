package com.ak.BankingApp.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TransferDTO {

    @NotBlank(message = "From account number is required")
    @Pattern(regexp = "\\d{10,18}", message = "From account number must be 10 to 18 digits")
    private String fromAccountNumber;

    @NotBlank(message = "To account number is required")
    @Pattern(regexp = "\\d{10,18}", message = "To account number must be 10 to 18 digits")
    private String toAccountNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

}

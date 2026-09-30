package com.bankease.dto;

import com.bankease.entity.AccountStatus;
import com.bankease.entity.AccountType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@AllArgsConstructor
@Getter
@Setter
public class AccountResponseDTO {
    private int id;
    private String accountNumber;
    private AccountType accountType;
     private BigDecimal balance;
    private AccountStatus status;

}

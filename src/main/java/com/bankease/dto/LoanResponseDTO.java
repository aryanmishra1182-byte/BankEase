package com.bankease.dto;

import com.bankease.entity.LoanStatus;
import com.bankease.entity.LoanType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LoanResponseDTO {

    private Integer id;
    private String loanReference;
    private String applicationReference;
    private String accountNumber;
    private LoanType loanType;
    private BigDecimal principalAmount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private BigDecimal outstandingAmount;
    private LoanStatus status;
    private LocalDateTime disbursedAt;
}
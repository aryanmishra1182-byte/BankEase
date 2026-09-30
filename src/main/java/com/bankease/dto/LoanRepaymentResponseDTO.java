package com.bankease.dto;

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
public class LoanRepaymentResponseDTO {

    private Integer id;
    private String repaymentReference;
    private String loanReference;
    private BigDecimal amount;
    private String remarks;
    private LocalDateTime paidAt;
}
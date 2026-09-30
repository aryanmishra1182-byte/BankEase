package com.bankease.dto;

import com.bankease.entity.LoanType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LoanApplicationRequestDTO {

    @NotNull
    private LoanType loanType;

    @NotNull
    @Positive
    private BigDecimal requestedAmount;

    @NotNull
    @Positive
    private Integer tenureMonths;

    @NotBlank
    private String purpose;
}
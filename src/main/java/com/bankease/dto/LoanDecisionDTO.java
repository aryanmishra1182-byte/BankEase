package com.bankease.dto;

import com.bankease.entity.LoanApplicationStatus;
import com.bankease.entity.LoanStatus;
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
public class LoanDecisionDTO {

    @NotNull
    private LoanApplicationStatus status;

    @Positive
    private BigDecimal approvedAmount;

    private String remarks;
}
package com.bankease.dto;

import com.bankease.entity.LoanApplicationStatus;
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
public class LoanApplicationResponseDTO {

    private Integer id;
    private String applicationReference;
    private LoanType loanType;
    private BigDecimal requestedAmount;
    private BigDecimal approvedAmount;
    private Integer tenureMonths;
    private String purpose;
    private LoanApplicationStatus status;
    private String remarks;
    private LocalDateTime appliedAt;
    private String applicantName;
    private String applicantEmail;
}
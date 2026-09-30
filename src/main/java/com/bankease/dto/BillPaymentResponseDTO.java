package com.bankease.dto;

import com.bankease.entity.BillPaymentStatus;
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
public class BillPaymentResponseDTO {

    private Integer id;
    private String paymentReference;
    private String senderAccountNumber;
    private Integer billerId;
    private String billerName;
    private String consumerNumber;
    private BigDecimal amount;
    private BillPaymentStatus status;
    private String remarks;
    private LocalDateTime paidAt;
}
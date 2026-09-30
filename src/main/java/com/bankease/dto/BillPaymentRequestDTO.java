package com.bankease.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
public class BillPaymentRequestDTO {
    @NotBlank
    private String idempotencyKey;
    @NotBlank
    private String senderAccountNumber;

    @NotNull
    private Integer billerId;

    @NotBlank
    @Pattern(regexp = "^[0-9]+$")
    private String consumerNumber;

    @NotNull
    @Positive
    private BigDecimal amount;

    private String remarks;
}
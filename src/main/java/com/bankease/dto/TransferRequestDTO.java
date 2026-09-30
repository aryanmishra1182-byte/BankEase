package com.bankease.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TransferRequestDTO {
    @NotBlank
    private String idempotencyKey;
    @NotBlank
  private  String receiverAccountNumber;
    @NotBlank
  private  String senderAccountNumber;
    @NotNull
            @Positive
  private BigDecimal amount;
  private String remarks;

}

package com.bankease.dto;

import com.bankease.entity.TransactionStatus;
import com.bankease.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TransactionResponseDTO {
   private Integer id;
       private String     transactionReference;
    private String senderAccountNumber;
    private String       receiverAccountNumber;
  private BigDecimal amount;
     private TransactionType transactionType;
   private TransactionStatus transactionStatus;
       private String     remarks;
   private LocalDateTime createdAt;
}

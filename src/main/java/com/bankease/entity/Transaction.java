package com.bankease.entity;

import jakarta.persistence.*;
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
@Entity
@Table(name = "transactions")
public class Transaction {
    @Column(unique = true, nullable = false)
    private String idempotencyKey;
    @Id
            @GeneratedValue(strategy = GenerationType.IDENTITY)
 private   Integer id;

    @Column(unique = true, nullable = false)
   private String transactionReference;
    @ManyToOne
    @JoinColumn(name = "sender_account_id", nullable = false)
   private Account senderAccount;
    @ManyToOne
    @JoinColumn(name = "receiver_account_id", nullable = false)
  private  Account receiverAccount;
    @Column(nullable = false, precision = 19, scale = 2)
   private BigDecimal amount;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
   private TransactionType transactionType;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
   private TransactionStatus transactionStatus;

  private  String remarks;
    @Column(nullable = false)
  private  LocalDateTime createdAt;
}

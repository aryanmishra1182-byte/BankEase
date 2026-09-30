package com.bankease.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
@Table(
        name = "bill_payments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_bill_payment_account_idempotency",
                        columnNames = {"account_id", "idempotency_key"}
                )
        }
)
public class BillPayment {
    @Column(nullable = false)
    private String idempotencyKey;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String paymentReference;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "biller_id", nullable = false)
    private Biller biller;

    @Column(nullable = false)
    private String consumerNumber;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillPaymentStatus status;

    private String remarks;

    @Column(nullable = false)
    private LocalDateTime paidAt;
}
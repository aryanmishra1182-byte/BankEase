package com.bankease.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Account {
    @Id
            @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @Column(unique = true)
    String accountNumber;
    @Enumerated(EnumType.STRING)
    AccountType accountType;
    BigDecimal balance;
    @Enumerated(EnumType.STRING)
    AccountStatus status;
    @ManyToOne
            @JoinColumn(name="user_id")
    Users user;
}

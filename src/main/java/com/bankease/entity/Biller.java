package com.bankease.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name="billers")
public class Biller {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

//    @Column(nullable = false, unique = true)
//    private String consumerNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillerStatus status;
}

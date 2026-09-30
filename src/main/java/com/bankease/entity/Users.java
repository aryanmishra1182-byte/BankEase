package com.bankease.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Users {
    @Id
            @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String fullname;
    @Column(unique = true)
    String email;
    String phone;
    String password;
    String role;
    String status;
}
package com.bankease.dto;

import com.bankease.entity.AccountType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class AccountRequestDTO {
    @NotNull
    @Enumerated(EnumType.STRING)
    private AccountType accountType;

}

package com.bankease.controller;

import com.bankease.dto.AccountResponseDTO;
import com.bankease.dto.AccountStatusDTO;
import com.bankease.dto.DepositRequestDTO;
import com.bankease.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/accounts")
public class AdminAccountController {
    private final AccountService accountService;

    public AdminAccountController(AccountService accountService) {
        this.accountService = accountService;
    }
    @PatchMapping("/{accountNumber}/status")
    public ResponseEntity<AccountResponseDTO> updateAccountStatus(
            @PathVariable String accountNumber,
            @Valid @RequestBody AccountStatusDTO statusDTO,
            @AuthenticationPrincipal Jwt jwt) {

        String adminEmail = jwt.getSubject();

        AccountResponseDTO updatedAccount =
                accountService.updateAccountStatus(
                        accountNumber,
                        statusDTO,
                        adminEmail
                );

        return ResponseEntity.ok(updatedAccount);
    }
    @PostMapping("/{accountNumber}/deposit")
    public ResponseEntity<AccountResponseDTO> depositMoney(
            @PathVariable String accountNumber,
            @Valid @RequestBody DepositRequestDTO request,
            @AuthenticationPrincipal Jwt jwt) {

        String adminEmail = jwt.getSubject();

        AccountResponseDTO updatedAccount =
                accountService.depositMoney(
                        accountNumber,
                        request,
                        adminEmail
                );

        return ResponseEntity.ok(updatedAccount);
    }
}

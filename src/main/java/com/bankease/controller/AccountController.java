package com.bankease.controller;

import com.bankease.dto.AccountRequestDTO;
import com.bankease.dto.AccountResponseDTO;
import com.bankease.service.AccountService;
import com.bankease.entity.Account;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/accounts")
    public ResponseEntity<AccountResponseDTO> createAccount(
            @Valid @RequestBody AccountRequestDTO request,
            @AuthenticationPrincipal Jwt jwt){
        String email=jwt.getSubject();
        AccountResponseDTO savedAccount=accountService.saveAccount(request,email);
      return  ResponseEntity.ok(savedAccount);
    }
    @GetMapping("/accounts")
    public ResponseEntity<List<AccountResponseDTO>>getAccounts(@AuthenticationPrincipal Jwt jwt){
        String email=jwt.getSubject();
        List<AccountResponseDTO>accounts=accountService.getUserAccounts(email);
        return ResponseEntity.ok(accounts);
    }
    @GetMapping("/accounts/{accountNumber}")
    public ResponseEntity<AccountResponseDTO>getAccountByNumber(@PathVariable String accountNumber,@AuthenticationPrincipal Jwt jwt){
        String email=jwt.getSubject();
        AccountResponseDTO account=accountService.getAccount(accountNumber,email);
        return ResponseEntity.ok(account);

    }
}

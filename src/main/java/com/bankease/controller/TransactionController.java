package com.bankease.controller;

import com.bankease.dto.TransactionResponseDTO;
import com.bankease.dto.TransferRequestDTO;
import com.bankease.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponseDTO> transferMoney(
            @Valid @RequestBody TransferRequestDTO request,
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        TransactionResponseDTO transaction =
                transactionService.transferMoney(request, email);

        return ResponseEntity.ok(transaction);
    }
    @GetMapping
    public ResponseEntity<List<TransactionResponseDTO>> getTransactions(
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        List<TransactionResponseDTO> transactions =
                transactionService.getUserTransactions(email);

        return ResponseEntity.ok(transactions);
    }
    @GetMapping("/{reference}")
    public ResponseEntity<TransactionResponseDTO> getTransaction(
            @PathVariable String reference,
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        TransactionResponseDTO transaction =
                transactionService.getTransaction(reference, email);

        return ResponseEntity.ok(transaction);
    }
}

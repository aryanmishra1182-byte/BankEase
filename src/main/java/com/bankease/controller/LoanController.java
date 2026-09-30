package com.bankease.controller;

import com.bankease.dto.LoanRepaymentDTO;
import com.bankease.dto.LoanRepaymentResponseDTO;
import com.bankease.dto.LoanResponseDTO;
import com.bankease.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    public ResponseEntity<List<LoanResponseDTO>> getMyLoans(
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        List<LoanResponseDTO> loans =
                loanService.getUserLoans(email);

        return ResponseEntity.ok(loans);
    }

    @GetMapping("/{loanReference}")
    public ResponseEntity<LoanResponseDTO> getLoan(
            @PathVariable String loanReference,
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        LoanResponseDTO loan =
                loanService.getLoan(loanReference, email);

        return ResponseEntity.ok(loan);
    }
    @PostMapping("/{loanReference}/repay")
    public ResponseEntity<LoanRepaymentResponseDTO> repayLoan(
            @PathVariable String loanReference,
            @Valid @RequestBody LoanRepaymentDTO request,
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        LoanRepaymentResponseDTO repayment =
                loanService.repayLoan(
                        loanReference,
                        request,
                        email);

        return ResponseEntity.ok(repayment);
    }
    @GetMapping("/{loanReference}/repayments")
    public ResponseEntity<List<LoanRepaymentResponseDTO>> getLoanRepayments(
            @PathVariable String loanReference,
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        List<LoanRepaymentResponseDTO> repayments =
                loanService.getLoanRepayments(
                        loanReference,
                        email);

        return ResponseEntity.ok(repayments);
    }
}
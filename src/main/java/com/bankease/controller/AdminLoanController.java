package com.bankease.controller;

import com.bankease.dto.LoanDisbursementDTO;
import com.bankease.dto.LoanResponseDTO;
import com.bankease.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/loans")
public class AdminLoanController {

    private final LoanService loanService;

    public AdminLoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/applications/{applicationReference}/disburse")
    public ResponseEntity<LoanResponseDTO> disburseLoan(
            @PathVariable String applicationReference,
            @Valid @RequestBody LoanDisbursementDTO request,
            @AuthenticationPrincipal Jwt jwt) {

        String adminEmail = jwt.getSubject();

        LoanResponseDTO loan =
                loanService.disburseLoan(
                        applicationReference,
                        request,
                        adminEmail);

        return ResponseEntity.ok(loan);
    }
}
package com.bankease.controller;

import com.bankease.dto.LoanApplicationResponseDTO;
import com.bankease.dto.LoanDecisionDTO;
import com.bankease.entity.LoanApplicationStatus;
import com.bankease.service.LoanApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/loans/applications")
public class AdminLoanApplicationController {

    private final LoanApplicationService loanApplicationService;

    public AdminLoanApplicationController(
            LoanApplicationService loanApplicationService) {
        this.loanApplicationService = loanApplicationService;
    }

    @GetMapping
    public ResponseEntity<List<LoanApplicationResponseDTO>> getApplications(
            @RequestParam(required = false) LoanApplicationStatus status) {

        return ResponseEntity.ok(
                loanApplicationService.getAdminApplications(status)
        );
    }

    @PatchMapping("/{applicationReference}/status")
    public ResponseEntity<LoanApplicationResponseDTO> reviewApplication(
            @PathVariable String applicationReference,
            @Valid @RequestBody LoanDecisionDTO decision,
            @AuthenticationPrincipal Jwt jwt) {

        String adminEmail = jwt.getSubject();

        LoanApplicationResponseDTO application =
                loanApplicationService.reviewApplication(
                        applicationReference,
                        decision,
                        adminEmail);

        return ResponseEntity.ok(application);
    }
}
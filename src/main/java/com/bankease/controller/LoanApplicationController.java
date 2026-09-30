package com.bankease.controller;

import com.bankease.dto.LoanApplicationRequestDTO;
import com.bankease.dto.LoanApplicationResponseDTO;
import com.bankease.dto.LoanDecisionDTO;
import com.bankease.service.LoanApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loans/applications")
public class LoanApplicationController {

    private final LoanApplicationService loanApplicationService;

    public LoanApplicationController(
            LoanApplicationService loanApplicationService) {
        this.loanApplicationService = loanApplicationService;
    }

    @PostMapping
    public ResponseEntity<LoanApplicationResponseDTO> applyForLoan(
            @Valid @RequestBody LoanApplicationRequestDTO request,
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        LoanApplicationResponseDTO application =
                loanApplicationService.applyForLoan(request, email);

        return ResponseEntity.ok(application);
    }

    @GetMapping
    public ResponseEntity<List<LoanApplicationResponseDTO>> getApplications(
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        List<LoanApplicationResponseDTO> applications =
                loanApplicationService.getUserApplications(email);

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{applicationReference}")
    public ResponseEntity<LoanApplicationResponseDTO> getApplication(
            @PathVariable String applicationReference,
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        LoanApplicationResponseDTO application =
                loanApplicationService.getApplication(
                        applicationReference,
                        email);

        return ResponseEntity.ok(application);
    }
}
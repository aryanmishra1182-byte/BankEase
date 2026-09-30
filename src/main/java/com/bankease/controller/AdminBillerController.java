package com.bankease.controller;

import com.bankease.dto.BillerRequestDTO;
import com.bankease.dto.BillerResponseDTO;
import com.bankease.entity.BillerStatus;
import com.bankease.service.BillerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/billers")
public class AdminBillerController {

    private final BillerService billerService;

    public AdminBillerController(BillerService billerService) {
        this.billerService = billerService;
    }

    @PostMapping
    public ResponseEntity<BillerResponseDTO> createBiller(
            @Valid @RequestBody BillerRequestDTO request,
            @AuthenticationPrincipal Jwt jwt) {

        String adminEmail = jwt.getSubject();

        BillerResponseDTO biller =
                billerService.createBiller(request, adminEmail);

        return ResponseEntity.ok(biller);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillerResponseDTO> getBiller(
            @PathVariable Integer id) {

        BillerResponseDTO biller =
                billerService.getBiller(id);

        return ResponseEntity.ok(biller);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BillerResponseDTO> updateBillerStatus(
            @PathVariable Integer id,
            @RequestParam BillerStatus status,
            @AuthenticationPrincipal Jwt jwt) {

        String adminEmail = jwt.getSubject();

        BillerResponseDTO biller =
                billerService.updateBillerStatus(
                        id,
                        status,
                        adminEmail);

        return ResponseEntity.ok(biller);
    }
}
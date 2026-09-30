package com.bankease.controller;

import com.bankease.dto.BillerResponseDTO;
import com.bankease.service.BillerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/billers")
public class BillerController {

    private final BillerService billerService;

    public BillerController(BillerService billerService) {
        this.billerService = billerService;
    }

    @GetMapping
    public ResponseEntity<List<BillerResponseDTO>> getActiveBillers() {

        List<BillerResponseDTO> billers =
                billerService.getActiveBillers();

        return ResponseEntity.ok(billers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillerResponseDTO> getBiller(
            @PathVariable Integer id) {

        BillerResponseDTO biller =
                billerService.getBiller(id);

        return ResponseEntity.ok(biller);
    }
}
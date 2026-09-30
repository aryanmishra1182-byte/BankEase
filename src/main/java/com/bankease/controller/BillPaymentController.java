package com.bankease.controller;

import com.bankease.dto.BillPaymentRequestDTO;
import com.bankease.dto.BillPaymentResponseDTO;
import com.bankease.service.BillPaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bills/payments")
public class BillPaymentController {

    private final BillPaymentService billPaymentService;

    public BillPaymentController(BillPaymentService billPaymentService) {
        this.billPaymentService = billPaymentService;
    }

    @PostMapping
    public ResponseEntity<BillPaymentResponseDTO> payBill(
            @Valid @RequestBody BillPaymentRequestDTO request,
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        BillPaymentResponseDTO payment =
                billPaymentService.payBill(request, email);

        return ResponseEntity.ok(payment);
    }

    @GetMapping
    public ResponseEntity<List<BillPaymentResponseDTO>> getBillPayments(
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        List<BillPaymentResponseDTO> payments =
                billPaymentService.getUserBillPayments(email);

        return ResponseEntity.ok(payments);
    }
    @GetMapping("/{paymentReference}")
    public ResponseEntity<BillPaymentResponseDTO> getBillPayment(
            @PathVariable String paymentReference,
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        BillPaymentResponseDTO payment =
                billPaymentService.getBillPayment(
                        paymentReference,
                        email);

        return ResponseEntity.ok(payment);
    }
}
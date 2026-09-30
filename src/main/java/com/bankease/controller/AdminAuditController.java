package com.bankease.controller;

import com.bankease.entity.AuditAction;
import com.bankease.entity.AuditLog;
import com.bankease.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/audit-logs")
public class AdminAuditController {

    private final AuditLogService auditLogService;

    public AdminAuditController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(
                auditLogService.getAllLogs()
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<AuditLog>> getMyLogs(
            @AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getSubject();

        return ResponseEntity.ok(
                auditLogService.getLogsByAdmin(email)
        );
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<List<AuditLog>> getLogsByAction(
            @PathVariable AuditAction action) {

        return ResponseEntity.ok(
                auditLogService.getLogsByAction(action)
        );
    }
}
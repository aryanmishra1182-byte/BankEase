package com.bankease.service;

import com.bankease.entity.AuditAction;
import com.bankease.entity.AuditLog;
import com.bankease.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(
            AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(
            AuditAction action,
            String performedBy,
            String targetType,
            String targetId,
            String description) {

        AuditLog auditLog = new AuditLog();

        auditLog.setAction(action);
        auditLog.setPerformedBy(performedBy);
        auditLog.setTargetType(targetType);
        auditLog.setTargetId(targetId);
        auditLog.setDescription(description);
        auditLog.setCreatedAt(LocalDateTime.now());

        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository
                .findByOrderByCreatedAtDesc();
    }

    public List<AuditLog> getLogsByAdmin(
            String email) {

        return auditLogRepository
                .findByPerformedByOrderByCreatedAtDesc(email);
    }

    public List<AuditLog> getLogsByAction(
            AuditAction action) {

        return auditLogRepository
                .findByActionOrderByCreatedAtDesc(action);
    }
}
package com.bankease.repository;

import com.bankease.entity.AuditLog;
import com.bankease.entity.AuditAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository
        extends JpaRepository<AuditLog, Integer> {

    List<AuditLog> findByOrderByCreatedAtDesc();

    List<AuditLog> findByPerformedByOrderByCreatedAtDesc(
            String performedBy);

    List<AuditLog> findByActionOrderByCreatedAtDesc(
            AuditAction action);
}
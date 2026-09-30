package com.bankease.service;

import com.bankease.dto.BillerRequestDTO;
import com.bankease.dto.BillerResponseDTO;
import com.bankease.entity.AuditAction;
import com.bankease.entity.Biller;
import com.bankease.entity.BillerStatus;
import com.bankease.exception.BillerNotFoundException;
import com.bankease.repository.BillerRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillerService {

    private final BillerRepository billerRepository;
    private final AuditLogService auditLogService;
    public BillerService(BillerRepository billerRepository, AuditLogService auditLogService) {
        this.billerRepository = billerRepository;
        this.auditLogService = auditLogService;
    }
@Transactional
    public BillerResponseDTO createBiller(
            BillerRequestDTO request,
            String performedBy) {

        Biller biller = new Biller();

        biller.setName(request.getName());
        biller.setCategory(request.getCategory());
        biller.setStatus(BillerStatus.ACTIVE);

        Biller savedBiller = billerRepository.save(biller);

        auditLogService.log(
                AuditAction.BILLER_CREATED,
                performedBy,
                "BILLER",
                String.valueOf(savedBiller.getId()),
                "Biller created: " + savedBiller.getName()
        );

        return new BillerResponseDTO(
                savedBiller.getId(),
                savedBiller.getName(),
                savedBiller.getCategory(),
                savedBiller.getStatus()
        );
    }

    public List<BillerResponseDTO> getActiveBillers() {

        List<Biller> billers =
                billerRepository.findByStatus(BillerStatus.ACTIVE);

        return billers.stream()
                .map(biller -> new BillerResponseDTO(
                        biller.getId(),
                        biller.getName(),
                        biller.getCategory(),
                        biller.getStatus()
                ))
                .toList();
    }

    public BillerResponseDTO getBiller(Integer id) {

        Biller biller = billerRepository.findById(id)
                .orElseThrow(() ->
                        new BillerNotFoundException("Biller Not Found"));

        return new BillerResponseDTO(
                biller.getId(),
                biller.getName(),
                biller.getCategory(),
                biller.getStatus()
        );
    }
@Transactional
    public BillerResponseDTO updateBillerStatus(
            Integer id,
            BillerStatus status,
            String performedBy) {

        Biller biller = billerRepository.findById(id)
                .orElseThrow(() ->
                        new BillerNotFoundException("Biller Not Found"));

        if (biller.getStatus() == status) {
            throw new IllegalArgumentException(
                    "Biller is already in this status");
        }

        biller.setStatus(status);

        Biller savedBiller = billerRepository.save(biller);

        AuditAction action;

        if (status == BillerStatus.ACTIVE) {
            action = AuditAction.BILLER_ACTIVATED;
        } else {
            action = AuditAction.BILLER_DEACTIVATED;
        }

        auditLogService.log(
                action,
                performedBy,
                "BILLER",
                String.valueOf(savedBiller.getId()),
                "Biller status changed to " + savedBiller.getStatus()
        );

        return new BillerResponseDTO(
                savedBiller.getId(),
                savedBiller.getName(),
                savedBiller.getCategory(),
                savedBiller.getStatus()
        );
    }
}
package com.bankease.service;
import com.bankease.dto.LoanApplicationRequestDTO;
import com.bankease.dto.LoanApplicationResponseDTO;
import com.bankease.dto.LoanDecisionDTO;
import com.bankease.entity.AuditAction;
import com.bankease.entity.LoanApplication;
import com.bankease.entity.LoanApplicationStatus;
import com.bankease.entity.Users;
import com.bankease.exception.InvalidLoanDecisionException;
import com.bankease.exception.LoanAlreadyReviewedException;
import com.bankease.exception.LoanApplicationNotFoundException;
import com.bankease.exception.UserNotFoundException;
import com.bankease.repository.LoanApplicationRepository;
import com.bankease.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class LoanApplicationService {
    private final UserRepository userRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final AuditLogService auditLogService;
    public LoanApplicationService(UserRepository userRepository, LoanApplicationRepository loanApplicationRepository, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.loanApplicationRepository = loanApplicationRepository;
        this.auditLogService = auditLogService;
    }
    public LoanApplicationResponseDTO applyForLoan(
            LoanApplicationRequestDTO request,
            String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        LoanApplication application = new LoanApplication();

        application.setApplicationReference(
                "LOAN-" + UUID.randomUUID()
        );

        application.setUser(user);
        application.setLoanType(request.getLoanType());
        application.setRequestedAmount(request.getRequestedAmount());
        application.setTenureMonths(request.getTenureMonths());
        application.setPurpose(request.getPurpose());
        application.setStatus(LoanApplicationStatus.PENDING);
        application.setAppliedAt(LocalDateTime.now());

        LoanApplication savedApplication =
                loanApplicationRepository.save(application);

        return new LoanApplicationResponseDTO(
                savedApplication.getId(),
                savedApplication.getApplicationReference(),
                savedApplication.getLoanType(),
                savedApplication.getRequestedAmount(),
                savedApplication.getApprovedAmount(),
                savedApplication.getTenureMonths(),
                savedApplication.getPurpose(),
                savedApplication.getStatus(),
                savedApplication.getRemarks(),
                savedApplication.getAppliedAt(),
                savedApplication.getUser().getFullname(),
                savedApplication.getUser().getEmail()
        );
    }
    public List<LoanApplicationResponseDTO> getUserApplications(
            String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        List<LoanApplication> applications =
                loanApplicationRepository.findByUser(user);

        return applications.stream()
                .map(application -> new LoanApplicationResponseDTO(
                        application.getId(),
                        application.getApplicationReference(),
                        application.getLoanType(),
                        application.getRequestedAmount(),
                        application.getApprovedAmount(),
                        application.getTenureMonths(),
                        application.getPurpose(),
                        application.getStatus(),
                        application.getRemarks(),
                        application.getAppliedAt(),
                        application.getUser().getFullname(),
                        application.getUser().getEmail()
                ))
                .toList();
    }

    public LoanApplicationResponseDTO getApplication(
            String applicationReference,
            String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        LoanApplication application =
                loanApplicationRepository
                        .findByApplicationReferenceAndUser(
                                applicationReference,
                                user)
                        .orElseThrow(() ->
                                new LoanApplicationNotFoundException(
                                        "Loan Application Not Found"));

        return new LoanApplicationResponseDTO(
                application.getId(),
                application.getApplicationReference(),
                application.getLoanType(),
                application.getRequestedAmount(),
                application.getApprovedAmount(),
                application.getTenureMonths(),
                application.getPurpose(),
                application.getStatus(),
                application.getRemarks(),
                application.getAppliedAt(),
                application.getUser().getFullname(),
                application.getUser().getEmail()
        );
    }
    @Transactional
    public LoanApplicationResponseDTO reviewApplication(
            String applicationReference,
            LoanDecisionDTO decision,
            String performedBy) {

        LoanApplication application =
                loanApplicationRepository
                        .findByApplicationReferenceForUpdate(
                                applicationReference)
                        .orElseThrow(() ->
                                new LoanApplicationNotFoundException(
                                        "Loan Application Not Found"));

        if (application.getStatus() != LoanApplicationStatus.PENDING) {
            throw new LoanAlreadyReviewedException(
                    "Loan Application has already been reviewed");
        }

        if (decision.getStatus() != LoanApplicationStatus.APPROVED &&
                decision.getStatus() != LoanApplicationStatus.REJECTED) {

            throw new InvalidLoanDecisionException(
                    "Only APPROVED or REJECTED is allowed");
        }

        if (decision.getStatus() == LoanApplicationStatus.APPROVED) {

            if (decision.getApprovedAmount() == null ||
                    decision.getApprovedAmount()
                            .compareTo(BigDecimal.ZERO) <= 0) {

                throw new InvalidLoanDecisionException(
                        "Approved amount is required for approval");
            }

            if (decision.getApprovedAmount()
                    .compareTo(application.getRequestedAmount()) > 0) {

                throw new InvalidLoanDecisionException(
                        "Approved amount cannot exceed requested amount");
            }

            application.setApprovedAmount(
                    decision.getApprovedAmount());
        }

        if (decision.getStatus() == LoanApplicationStatus.REJECTED) {
            application.setApprovedAmount(null);
        }

        application.setStatus(decision.getStatus());
        application.setRemarks(decision.getRemarks());

        LoanApplication savedApplication =
                loanApplicationRepository.save(application);

        AuditAction action;

        if (savedApplication.getStatus() ==
                LoanApplicationStatus.APPROVED) {

            action = AuditAction.LOAN_APPROVED;

        } else {

            action = AuditAction.LOAN_REJECTED;
        }

        auditLogService.log(
                action,
                performedBy,
                "LOAN_APPLICATION",
                savedApplication.getApplicationReference(),
                "Loan application status changed to "
                        + savedApplication.getStatus()
        );

        return new LoanApplicationResponseDTO(
                savedApplication.getId(),
                savedApplication.getApplicationReference(),
                savedApplication.getLoanType(),
                savedApplication.getRequestedAmount(),
                savedApplication.getApprovedAmount(),
                savedApplication.getTenureMonths(),
                savedApplication.getPurpose(),
                savedApplication.getStatus(),
                savedApplication.getRemarks(),
                savedApplication.getAppliedAt(),
                application.getUser().getFullname(),
                application.getUser().getEmail()
        );
    }
    public List<LoanApplicationResponseDTO> getAdminApplications(
            LoanApplicationStatus status) {

        List<LoanApplication> applications =
                status == null
                        ? loanApplicationRepository
                        .findAllByOrderByAppliedAtDesc()
                        : loanApplicationRepository
                        .findByStatusOrderByAppliedAtDesc(status);

        return applications.stream()
                .map(application -> new LoanApplicationResponseDTO(
                        application.getId(),
                        application.getApplicationReference(),
                        application.getLoanType(),
                        application.getRequestedAmount(),
                        application.getApprovedAmount(),
                        application.getTenureMonths(),
                        application.getPurpose(),
                        application.getStatus(),
                        application.getRemarks(),
                        application.getAppliedAt(),
                        application.getUser().getFullname(),
                        application.getUser().getEmail()
                ))
                .toList();
    }

}

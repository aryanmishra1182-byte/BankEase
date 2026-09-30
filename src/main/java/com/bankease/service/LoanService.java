package com.bankease.service;

import com.bankease.dto.LoanDisbursementDTO;
import com.bankease.dto.LoanRepaymentDTO;
import com.bankease.dto.LoanRepaymentResponseDTO;
import com.bankease.dto.LoanResponseDTO;
import com.bankease.entity.*;
import com.bankease.exception.*;
import com.bankease.repository.*;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LoanService {
    private final LoanRepaymentRepository loanRepaymentRepository;
    private final LoanRepository loanRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    public LoanService(
            LoanRepaymentRepository loanRepaymentRepository, LoanRepository loanRepository,
            LoanApplicationRepository loanApplicationRepository,
            AccountRepository accountRepository, UserRepository userRepository, AuditLogService auditLogService) {
        this.loanRepaymentRepository = loanRepaymentRepository;

        this.loanRepository = loanRepository;
        this.loanApplicationRepository = loanApplicationRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public LoanResponseDTO disburseLoan(
            String applicationReference,
            LoanDisbursementDTO request,
            String performedBy){

        LoanApplication application =
                loanApplicationRepository
                        .findByApplicationReferenceForUpdate(
                                applicationReference)
                        .orElseThrow(() ->
                                new LoanApplicationNotFoundException(
                                        "Loan Application Not Found"));

        if (application.getStatus() != LoanApplicationStatus.APPROVED) {
            throw new ApplicationNotApprovedException(
                    "Only approved applications can be disbursed");
        }

        if (application.getApprovedAmount() == null) {
            throw new AmountMissingException(
                    "Approved amount is missing");
        }

        if (loanRepository
                .findByApplicationId(application.getId())
                .isPresent()) {

            throw new LoanAlreadyDisbursedException(
                    "Loan has already been disbursed");
        }

        Users user = application.getUser();

        Account account = accountRepository
                .findByAccountNumberAndUserForUpdate(
                        request.getAccountNumber(),
                        user)
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Destination Account Not Found"));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountBlockedException(
                    "Destination Account Is Not Active");
        }

        account.setBalance(
                account.getBalance()
                        .add(application.getApprovedAmount())
        );

        accountRepository.save(account);

        Loan loan = new Loan();

        loan.setLoanReference(
                "LN-" + UUID.randomUUID()
        );

        loan.setApplication(application);
        loan.setUser(user);
        loan.setAccount(account);
        loan.setLoanType(application.getLoanType());
        loan.setPrincipalAmount(
                application.getApprovedAmount()
        );
        loan.setInterestRate(
                request.getInterestRate()
        );
        loan.setTenureMonths(
                application.getTenureMonths()
        );
        loan.setOutstandingAmount(
                application.getApprovedAmount()
        );
        loan.setStatus(LoanStatus.ACTIVE);
        loan.setDisbursedAt(LocalDateTime.now());

        Loan savedLoan = loanRepository.save(loan);
auditLogService.log(
    AuditAction.LOAN_DISBURSED,
    performedBy,
            "LOAN",
            savedLoan.getLoanReference(),
            "Loan disbursed with amount "
            + savedLoan.getPrincipalAmount()
            );
        return new LoanResponseDTO(
                savedLoan.getId(),
                savedLoan.getLoanReference(),
                application.getApplicationReference(),
                account.getAccountNumber(),
                savedLoan.getLoanType(),
                savedLoan.getPrincipalAmount(),
                savedLoan.getInterestRate(),
                savedLoan.getTenureMonths(),
                savedLoan.getOutstandingAmount(),
                savedLoan.getStatus(),
                savedLoan.getDisbursedAt()
        );
    }
    public List<LoanResponseDTO> getUserLoans(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        List<Loan> loans = loanRepository.findByUser(user);

        return loans.stream()
                .map(loan -> new LoanResponseDTO(
                        loan.getId(),
                        loan.getLoanReference(),
                        loan.getApplication().getApplicationReference(),
                        loan.getAccount().getAccountNumber(),
                        loan.getLoanType(),
                        loan.getPrincipalAmount(),
                        loan.getInterestRate(),
                        loan.getTenureMonths(),
                        loan.getOutstandingAmount(),
                        loan.getStatus(),
                        loan.getDisbursedAt()
                ))
                .toList();
    }
    public LoanResponseDTO getLoan(
            String loanReference,
            String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        Loan loan = loanRepository
                .findByLoanReferenceAndUser(
                        loanReference,
                        user)
                .orElseThrow(() ->
                        new LoanNotFoundException("Loan Not Found"));

        return new LoanResponseDTO(
                loan.getId(),
                loan.getLoanReference(),
                loan.getApplication().getApplicationReference(),
                loan.getAccount().getAccountNumber(),
                loan.getLoanType(),
                loan.getPrincipalAmount(),
                loan.getInterestRate(),
                loan.getTenureMonths(),
                loan.getOutstandingAmount(),
                loan.getStatus(),
                loan.getDisbursedAt()
        );
    }
    @Transactional
    public LoanRepaymentResponseDTO repayLoan(
            String loanReference,
            LoanRepaymentDTO request,
            String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        Loan loan = loanRepository
                .findByLoanReferenceAndUserForUpdate(
                        loanReference,
                        user)
                .orElseThrow(() ->
                        new LoanNotFoundException("Loan Not Found"));

        // Check whether this repayment was already processed
        Optional<LoanRepayment> existingRepayment =
                loanRepaymentRepository.findByIdempotencyKeyAndLoan(
                        request.getIdempotencyKey(),
                        loan);

        if (existingRepayment.isPresent()) {

            LoanRepayment repayment = existingRepayment.get();

            return new LoanRepaymentResponseDTO(
                    repayment.getId(),
                    repayment.getRepaymentReference(),
                    repayment.getLoan().getLoanReference(),
                    repayment.getAmount(),
                    repayment.getRemarks(),
                    repayment.getPaidAt()
            );
        }

        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new LoanNotActiveException(
                    "Loan is not active");
        }

        BigDecimal amount = request.getAmount();

        if (amount.compareTo(
                loan.getOutstandingAmount()) > 0) {

            throw new InvalidLoanRepaymentException(
                    "Repayment amount exceeds outstanding amount");
        }

        Account account = accountRepository
                .findByAccountNumberAndUserForUpdate(
                        loan.getAccount().getAccountNumber(),
                        user)
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Loan Account Not Found"));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountBlockedException(
                    "Account is not active");
        }

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(
                    "Insufficient balance");
        }

        // Debit customer account
        account.setBalance(
                account.getBalance().subtract(amount)
        );

        // Reduce loan outstanding amount
        loan.setOutstandingAmount(
                loan.getOutstandingAmount().subtract(amount)
        );

        // Close loan when fully repaid
        if (loan.getOutstandingAmount()
                .compareTo(BigDecimal.ZERO) == 0) {

            loan.setStatus(LoanStatus.CLOSED);
        }

        accountRepository.save(account);
        loanRepository.save(loan);

        // Create repayment record
        LoanRepayment repayment = new LoanRepayment();

        repayment.setRepaymentReference(
                "LR-" + UUID.randomUUID()
        );

        repayment.setIdempotencyKey(
                request.getIdempotencyKey()
        );

        repayment.setLoan(loan);
        repayment.setAmount(amount);
        repayment.setRemarks(request.getRemarks());
        repayment.setPaidAt(LocalDateTime.now());

        LoanRepayment savedRepayment =
                loanRepaymentRepository.save(repayment);

        return new LoanRepaymentResponseDTO(
                savedRepayment.getId(),
                savedRepayment.getRepaymentReference(),
                loan.getLoanReference(),
                savedRepayment.getAmount(),
                savedRepayment.getRemarks(),
                savedRepayment.getPaidAt()
        );
    }
    public List<LoanRepaymentResponseDTO> getLoanRepayments(
            String loanReference,
            String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        Loan loan = loanRepository
                .findByLoanReferenceAndUser(
                        loanReference,
                        user)
                .orElseThrow(() ->
                        new LoanNotFoundException("Loan Not Found"));

        List<LoanRepayment> repayments =
                loanRepaymentRepository
                        .findByLoanOrderByPaidAtDesc(loan);

        return repayments.stream()
                .map(repayment -> new LoanRepaymentResponseDTO(
                        repayment.getId(),
                        repayment.getRepaymentReference(),
                        repayment.getLoan().getLoanReference(),
                        repayment.getAmount(),
                        repayment.getRemarks(),
                        repayment.getPaidAt()
                ))
                .toList();
    }
}
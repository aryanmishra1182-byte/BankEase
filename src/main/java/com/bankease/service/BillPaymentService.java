package com.bankease.service;

import com.bankease.dto.BillPaymentRequestDTO;
import com.bankease.dto.BillPaymentResponseDTO;
import com.bankease.entity.Account;
import com.bankease.entity.AccountStatus;
import com.bankease.entity.BillPayment;
import com.bankease.entity.BillPaymentStatus;
import com.bankease.entity.Biller;
import com.bankease.entity.BillerStatus;
import com.bankease.entity.Users;
import com.bankease.exception.*;
import com.bankease.repository.AccountRepository;
import com.bankease.repository.BillPaymentRepository;
import com.bankease.repository.BillerRepository;
import com.bankease.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BillPaymentService {

    private final AccountRepository accountRepository;
    private final BillerRepository billerRepository;
    private final BillPaymentRepository billPaymentRepository;
    private final UserRepository userRepository;

    public BillPaymentService(
            AccountRepository accountRepository,
            BillerRepository billerRepository,
            BillPaymentRepository billPaymentRepository,
            UserRepository userRepository) {

        this.accountRepository = accountRepository;
        this.billerRepository = billerRepository;
        this.billPaymentRepository = billPaymentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BillPaymentResponseDTO payBill(
            BillPaymentRequestDTO request,
            String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        Account account = accountRepository
                .findByAccountNumberAndUserForUpdate(
                        request.getSenderAccountNumber(),
                        user)
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Account Not Found"));

        Optional<BillPayment> existingPayment =
                billPaymentRepository.findByIdempotencyKeyAndAccount(
                        request.getIdempotencyKey(),
                        account);

        if (existingPayment.isPresent()) {

            BillPayment payment = existingPayment.get();

            return new BillPaymentResponseDTO(
                    payment.getId(),
                    payment.getPaymentReference(),
                    payment.getAccount().getAccountNumber(),
                    payment.getBiller().getId(),
                    payment.getBiller().getName(),
                    payment.getConsumerNumber(),
                    payment.getAmount(),
                    payment.getStatus(),
                    payment.getRemarks(),
                    payment.getPaidAt()
            );
        }

        Biller biller = billerRepository.findById(request.getBillerId())
                .orElseThrow(() ->
                        new BillerNotFoundException("Biller Not Found"));

        if (biller.getStatus() != BillerStatus.ACTIVE) {
            throw new BillerNotActiveException("Biller Is Not Active");
        }

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountBlockedException(
                    "Account Is Not Active");
        }

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException(
                    "Insufficient Balance");
        }

        account.setBalance(
                account.getBalance().subtract(request.getAmount())
        );

        accountRepository.save(account);

        BillPayment payment = new BillPayment();

        payment.setPaymentReference(
                "BILL-" + UUID.randomUUID()
        );

        payment.setIdempotencyKey(
                request.getIdempotencyKey()
        );

        payment.setAccount(account);
        payment.setBiller(biller);
        payment.setConsumerNumber(request.getConsumerNumber());
        payment.setAmount(request.getAmount());
        payment.setStatus(BillPaymentStatus.SUCCESS);
        payment.setRemarks(request.getRemarks());
        payment.setPaidAt(LocalDateTime.now());

        BillPayment savedPayment =
                billPaymentRepository.save(payment);

        return new BillPaymentResponseDTO(
                savedPayment.getId(),
                savedPayment.getPaymentReference(),
                savedPayment.getAccount().getAccountNumber(),
                savedPayment.getBiller().getId(),
                savedPayment.getBiller().getName(),
                savedPayment.getConsumerNumber(),
                savedPayment.getAmount(),
                savedPayment.getStatus(),
                savedPayment.getRemarks(),
                savedPayment.getPaidAt()
        );
    }

    public List<BillPaymentResponseDTO> getUserBillPayments(
            String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        List<Account> accounts =
                accountRepository.findByUser(user);

        return accounts.stream()
                .flatMap(account ->
                        billPaymentRepository.findByAccount(account)
                                .stream())
                .map(payment -> new BillPaymentResponseDTO(
                        payment.getId(),
                        payment.getPaymentReference(),
                        payment.getAccount().getAccountNumber(),
                        payment.getBiller().getId(),
                        payment.getBiller().getName(),
                        payment.getConsumerNumber(),
                        payment.getAmount(),
                        payment.getStatus(),
                        payment.getRemarks(),
                        payment.getPaidAt()
                ))
                .toList();
    }
    public BillPaymentResponseDTO getBillPayment(
            String paymentReference,
            String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        List<Account> accounts =
                accountRepository.findByUser(user);

        for (Account account : accounts) {

            Optional<BillPayment> payment =
                    billPaymentRepository.findByPaymentReferenceAndAccount(
                            paymentReference,
                            account);

            if (payment.isPresent()) {

                BillPayment billPayment = payment.get();

                return new BillPaymentResponseDTO(
                        billPayment.getId(),
                        billPayment.getPaymentReference(),
                        billPayment.getAccount().getAccountNumber(),
                        billPayment.getBiller().getId(),
                        billPayment.getBiller().getName(),
                        billPayment.getConsumerNumber(),
                        billPayment.getAmount(),
                        billPayment.getStatus(),
                        billPayment.getRemarks(),
                        billPayment.getPaidAt()
                );
            }
        }

        throw new BillPaymentNotFoundException("Bill Payment Not Found");
    }
}
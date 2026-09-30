package com.bankease.service;
import com.bankease.dto.TransactionResponseDTO;
import com.bankease.dto.TransferRequestDTO;
import com.bankease.entity.*;
import com.bankease.exception.*;
import com.bankease.repository.AccountRepository;
import com.bankease.repository.TransactionRepository;
import com.bankease.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransactionService {
private final AccountRepository accountRepository;
private final UserRepository userRepository;
private final TransactionRepository transactionRepository;

    public TransactionService(AccountRepository accountRepository, UserRepository userRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }
    @Transactional
    public TransactionResponseDTO transferMoney(
            TransferRequestDTO transferRequestDTO,
            String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));
        Optional<Transaction> existingTransaction =
                transactionRepository.findByIdempotencyKeyAndUser(
                        transferRequestDTO.getIdempotencyKey(),user);

        if (existingTransaction.isPresent()) {
            Transaction transaction = existingTransaction.get();

            return new TransactionResponseDTO(
                    transaction.getId(),
                    transaction.getTransactionReference(),
                    transaction.getSenderAccount().getAccountNumber(),
                    transaction.getReceiverAccount().getAccountNumber(),
                    transaction.getAmount(),
                    transaction.getTransactionType(),
                    transaction.getTransactionStatus(),
                    transaction.getRemarks(),
                    transaction.getCreatedAt()
            );
        }
        // First locate both accounts without locking
        Account senderCandidate = accountRepository
                .findByAccountNumberAndUser(
                        transferRequestDTO.getSenderAccountNumber(),
                        user)
                .orElseThrow(() ->
                        new AccountNotFoundException("Sender Account Not Found"));

        Account receiverCandidate = accountRepository
                .findByAccountNumber(
                        transferRequestDTO.getReceiverAccountNumber())
                .orElseThrow(() ->
                        new AccountNotFoundException("Receiver Account Not Found"));

        // Sender and receiver cannot be the same
        if (senderCandidate.getAccountNumber()
                .equals(receiverCandidate.getAccountNumber())) {

            throw new SameAccountTransferException(
                    "Sender and receiver accounts cannot be the same");
        }

        Account sender;
        Account receiver;

        /*
         * Always lock accounts in ascending ID order.
         * This prevents A -> B and B -> A transfers
         * from acquiring locks in opposite orders.
         */
        if (senderCandidate.getId() < receiverCandidate.getId()) {

            sender = accountRepository
                    .findByAccountNumberAndUserForUpdate(
                            senderCandidate.getAccountNumber(),
                            user)
                    .orElseThrow(() ->
                            new AccountNotFoundException(
                                    "Sender Account Not Found"));

            receiver = accountRepository
                    .findByAccountNumberForUpdate(
                            receiverCandidate.getAccountNumber())
                    .orElseThrow(() ->
                            new AccountNotFoundException(
                                    "Receiver Account Not Found"));

        } else {

            receiver = accountRepository
                    .findByAccountNumberForUpdate(
                            receiverCandidate.getAccountNumber())
                    .orElseThrow(() ->
                            new AccountNotFoundException(
                                    "Receiver Account Not Found"));

            sender = accountRepository
                    .findByAccountNumberAndUserForUpdate(
                            senderCandidate.getAccountNumber(),
                            user)
                    .orElseThrow(() ->
                            new AccountNotFoundException(
                                    "Sender Account Not Found"));
        }

        if (sender.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountBlockedException(
                    "Sender account is not active");
        }

        if (receiver.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountBlockedException(
                    "Receiver account is not active");
        }

        BigDecimal amount = transferRequestDTO.getAmount();

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(
                    "Insufficient balance");
        }

        sender.setBalance(
                sender.getBalance().subtract(amount));

        receiver.setBalance(
                receiver.getBalance().add(amount));

        accountRepository.save(sender);
        accountRepository.save(receiver);

        Transaction transaction = new Transaction();

        transaction.setTransactionReference(
                "TXN-" + UUID.randomUUID());
        transaction.setIdempotencyKey(
                transferRequestDTO.getIdempotencyKey()
        );
        transaction.setSenderAccount(sender);
        transaction.setReceiverAccount(receiver);
        transaction.setAmount(amount);
        transaction.setTransactionType(TransactionType.TRANSFER);
        transaction.setTransactionStatus(TransactionStatus.SUCCESS);
        transaction.setRemarks(transferRequestDTO.getRemarks());
        transaction.setCreatedAt(LocalDateTime.now());

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        return new TransactionResponseDTO(
                savedTransaction.getId(),
                savedTransaction.getTransactionReference(),
                sender.getAccountNumber(),
                receiver.getAccountNumber(),
                savedTransaction.getAmount(),
                savedTransaction.getTransactionType(),
                savedTransaction.getTransactionStatus(),
                savedTransaction.getRemarks(),
                savedTransaction.getCreatedAt()
        );
    }
    public List<TransactionResponseDTO> getUserTransactions(String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        List<Transaction> transactions =
                transactionRepository.findTransactionsForUser(user);

        return transactions.stream()
                .map(transaction -> new TransactionResponseDTO(
                        transaction.getId(),
                        transaction.getTransactionReference(),
                        transaction.getSenderAccount().getAccountNumber(),
                        transaction.getReceiverAccount().getAccountNumber(),
                        transaction.getAmount(),
                        transaction.getTransactionType(),
                        transaction.getTransactionStatus(),
                        transaction.getRemarks(),
                        transaction.getCreatedAt()
                ))
                .toList();
    }
    public TransactionResponseDTO getTransaction(
            String reference,
            String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        Transaction transaction = transactionRepository
                .findByReferenceAndUser(reference, user)
                .orElseThrow(() ->
                        new TransactionNotFoundException("Transaction Not Found"));

        return new TransactionResponseDTO(
                transaction.getId(),
                transaction.getTransactionReference(),
                transaction.getSenderAccount().getAccountNumber(),
                transaction.getReceiverAccount().getAccountNumber(),
                transaction.getAmount(),
                transaction.getTransactionType(),
                transaction.getTransactionStatus(),
                transaction.getRemarks(),
                transaction.getCreatedAt()
        );
    }

}

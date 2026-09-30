package com.bankease.service;

import com.bankease.dto.AccountRequestDTO;
import com.bankease.dto.AccountResponseDTO;
import com.bankease.dto.AccountStatusDTO;
import com.bankease.dto.DepositRequestDTO;
import com.bankease.entity.Account;
import com.bankease.entity.AccountStatus;
import com.bankease.entity.AuditAction;
import com.bankease.entity.Users;
import com.bankease.exception.AccountBlockedException;
import com.bankease.exception.AccountNotFoundException;
import com.bankease.exception.UserNotFoundException;
import com.bankease.repository.AccountRepository;
import com.bankease.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    private final SecureRandom random = new SecureRandom();

    public AccountService(AccountRepository accountRepository,
                          UserRepository userRepository, AuditLogService auditLogService) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    public AccountResponseDTO saveAccount(AccountRequestDTO request, String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User Not Found"));

        Account account = new Account();

        String accountNumber;

        do {
            accountNumber = String.valueOf(
                    100_000_000_000L + random.nextLong(900_000_000_000L)
            );
        } while (accountRepository.existsByAccountNumber(accountNumber));

        account.setAccountNumber(accountNumber);
        account.setAccountType(request.getAccountType());
        account.setBalance(BigDecimal.ZERO);
        account.setStatus(AccountStatus.ACTIVE);
        account.setUser(user);

        Account savedAccount = accountRepository.save(account);

        return new AccountResponseDTO(
                savedAccount.getId(),
                savedAccount.getAccountNumber(),
                savedAccount.getAccountType(),
                savedAccount.getBalance(),
                savedAccount.getStatus()
        );
    }
    public List<AccountResponseDTO>getUserAccounts(String email){
Users user=userRepository.findByEmail(email)
        .orElseThrow(()->new UserNotFoundException("User Not Found"));
List<Account> accounts=accountRepository.findByUser(user);
return accounts.stream()
        .map(account->new AccountResponseDTO(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountType(),
                account.getBalance(),
                account.getStatus()
        ))
        .toList();
    }
    public AccountResponseDTO getAccount(String accountNumber,String email){
        Users user=userRepository.findByEmail(email)
                .orElseThrow(()->new UserNotFoundException("User Not Found"));
        Account account=accountRepository.findByAccountNumberAndUser(accountNumber,user)
                .orElseThrow(()->new AccountNotFoundException("Account Not Found"));
        return new AccountResponseDTO(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountType(),
                account.getBalance(),
                account.getStatus()
        );
    }
    @Transactional
    public AccountResponseDTO updateAccountStatus(
            String accountNumber,
            AccountStatusDTO statusDTO,
            String performedBy) {

        Account account = accountRepository
                .findByAccountNumberForUpdate(accountNumber)
                .orElseThrow(() ->
                        new AccountNotFoundException("Account Not Found"));

        account.setStatus(statusDTO.getStatus());

        Account savedAccount = accountRepository.save(account);

        AuditAction action;

        if (statusDTO.getStatus() == AccountStatus.BLOCKED) {
            action = AuditAction.ACCOUNT_BLOCKED;
        } else {
            action = AuditAction.ACCOUNT_ACTIVATED;
        }

        auditLogService.log(
                action,
                performedBy,
                "ACCOUNT",
                savedAccount.getAccountNumber(),
                "Account status changed to "
                        + savedAccount.getStatus()
        );

        return new AccountResponseDTO(
                savedAccount.getId(),
                savedAccount.getAccountNumber(),
                savedAccount.getAccountType(),
                savedAccount.getBalance(),
                savedAccount.getStatus()
        );
    }
    @Transactional
    public AccountResponseDTO depositMoney(
            String accountNumber,
            DepositRequestDTO request,
            String performedBy) {

        Account account = accountRepository
                .findByAccountNumberForUpdate(accountNumber)
                .orElseThrow(() ->
                        new AccountNotFoundException("Account Not Found"));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new AccountBlockedException(
                    "Account is not active");
        }

        account.setBalance(
                account.getBalance().add(request.getAmount())
        );

        Account savedAccount = accountRepository.save(account);
        auditLogService.log(
                AuditAction.ACCOUNT_DEPOSIT,
                performedBy,
                "ACCOUNT",
                savedAccount.getAccountNumber(),
                "Development deposit of "
                        + request.getAmount()
        );
        return new AccountResponseDTO(
                savedAccount.getId(),
                savedAccount.getAccountNumber(),
                savedAccount.getAccountType(),
                savedAccount.getBalance(),
                savedAccount.getStatus()
        );
    }
}
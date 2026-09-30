package com.bankease.repository;

import com.bankease.entity.Account;
import com.bankease.entity.Users;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account,Integer> {
public boolean existsByAccountNumber(String accountNumber);
public List<Account> findByUser(Users user);
public Optional<Account> findByAccountNumberAndUser(String accountNumber,Users user);
public Optional<Account> findByAccountNumber(String accountNumber);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.accountNumber = :accountNumber")
    Optional<Account> findByAccountNumberForUpdate( @Param("accountNumber") String accountNumber);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
       SELECT a FROM Account a
       WHERE a.accountNumber = :accountNumber
       AND a.user = :user
       """)
    Optional<Account> findByAccountNumberAndUserForUpdate(
            @Param("accountNumber")    String accountNumber,
            @Param("user")   Users user
    );
}

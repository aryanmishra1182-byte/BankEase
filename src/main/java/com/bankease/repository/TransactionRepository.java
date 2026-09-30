package com.bankease.repository;

import com.bankease.entity.Transaction;
import com.bankease.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Integer> {
    @Query("""
       SELECT t FROM Transaction t
       WHERE t.senderAccount.user = :user
          OR t.receiverAccount.user = :user
       ORDER BY t.createdAt DESC
       """)
    List<Transaction> findTransactionsForUser(@Param("user") Users user);
    @Query("""
       SELECT t FROM Transaction t
       WHERE t.transactionReference = :reference
       AND (
            t.senderAccount.user = :user
            OR
            t.receiverAccount.user = :user
       )
       """)
    Optional<Transaction> findByReferenceAndUser(
            @Param("reference") String reference,
            @Param("user") Users user
    );
    @Query("""
       SELECT t FROM Transaction t
       WHERE t.idempotencyKey = :idempotencyKey
       AND t.senderAccount.user = :user
       """)
    Optional<Transaction> findByIdempotencyKeyAndUser(
            @Param("idempotencyKey") String idempotencyKey,
            @Param("user") Users user
    );
}

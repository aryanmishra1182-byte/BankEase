package com.bankease.repository;

import com.bankease.entity.Account;
import com.bankease.entity.BillPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillPaymentRepository
        extends JpaRepository<BillPayment, Integer> {

    List<BillPayment> findByAccount(Account account);

    Optional<BillPayment> findByPaymentReferenceAndAccount(
            String paymentReference,
            Account account
    );
    Optional<BillPayment> findByIdempotencyKeyAndAccount(
            String idempotencyKey,
            Account account
    );
}
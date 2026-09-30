package com.bankease.repository;

import com.bankease.entity.Loan;
import com.bankease.entity.LoanRepayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepaymentRepository
        extends JpaRepository<LoanRepayment, Integer> {

    List<LoanRepayment> findByLoanOrderByPaidAtDesc(Loan loan);

    Optional<LoanRepayment> findByRepaymentReferenceAndLoan(
            String repaymentReference,
            Loan loan
    );

    Optional<LoanRepayment> findByIdempotencyKeyAndLoan(
            String idempotencyKey,
            Loan loan
    );
}
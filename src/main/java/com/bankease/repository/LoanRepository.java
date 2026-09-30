package com.bankease.repository;

import com.bankease.entity.Loan;
import com.bankease.entity.LoanStatus;
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
public interface LoanRepository extends JpaRepository<Loan, Integer> {

    List<Loan> findByUser(Users user);

    Optional<Loan> findByLoanReferenceAndUser(
            String loanReference,
            Users user
    );

    Optional<Loan> findByApplicationId(Integer applicationId);

    List<Loan> findByStatus(LoanStatus status);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
       SELECT l FROM Loan l
       WHERE l.loanReference = :loanReference
       AND l.user = :user
       """)
    Optional<Loan> findByLoanReferenceAndUserForUpdate(
            @Param("loanReference") String loanReference,
            @Param("user") Users user
    );
}
package com.bankease.repository;

import com.bankease.entity.LoanApplication;
import com.bankease.entity.LoanApplicationStatus;
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
public interface LoanApplicationRepository
        extends JpaRepository<LoanApplication, Integer> {

    List<LoanApplication> findByUser(Users user);

    Optional<LoanApplication> findByApplicationReferenceAndUser(
            String applicationReference,
            Users user
    );

    List<LoanApplication> findByStatusOrderByAppliedAtDesc(LoanApplicationStatus status);
    Optional<LoanApplication> findByApplicationReference(
            String applicationReference);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
       SELECT l FROM LoanApplication l
       WHERE l.applicationReference = :applicationReference
       """)
    Optional<LoanApplication> findByApplicationReferenceForUpdate(
            @Param("applicationReference") String applicationReference
    );
    List<LoanApplication> findAllByOrderByAppliedAtDesc();
}
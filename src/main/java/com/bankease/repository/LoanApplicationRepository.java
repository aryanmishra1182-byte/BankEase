package com.bankease.repository;

import com.bankease.entity.LoanApplication;
import com.bankease.entity.LoanApplicationStatus;
import com.bankease.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
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

    List<LoanApplication> findByStatus(LoanApplicationStatus status);
    Optional<LoanApplication> findByApplicationReference(
            String applicationReference);
}
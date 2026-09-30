package com.bankease.repository;

import com.bankease.entity.Biller;
import com.bankease.entity.BillerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillerRepository extends JpaRepository<Biller, Integer> {

    List<Biller> findByStatus(BillerStatus status);
}
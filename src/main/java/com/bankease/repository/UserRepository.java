package com.bankease.repository;

import com.bankease.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users,Integer> {
    public boolean existsByEmail(String email);
    public Optional<Users> findByEmail(String email);
}

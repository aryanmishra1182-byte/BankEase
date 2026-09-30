package com.bankease.config;

import com.bankease.entity.Users;
import com.bankease.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataInitializer {

    @Bean
    public ApplicationRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${admin.email}") String adminEmail,
            @Value("${admin.password}") String adminPassword) {

        return args -> {

            if (userRepository.existsByEmail(adminEmail)) {
                return;
            }

            Users admin = new Users();

            admin.setFullname("BankEase Admin");
            admin.setEmail(adminEmail);
            admin.setPhone("9999999999");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE");

            userRepository.save(admin);
        };
    }
}
package com.bankease.controller;

import com.bankease.dto.AdminUserResponseDTO;
import com.bankease.dto.UserStatusDTO;
import com.bankease.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<AdminUserResponseDTO>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserResponseDTO> getUserById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminUserResponseDTO> updateUserStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UserStatusDTO statusDTO,
            @AuthenticationPrincipal Jwt jwt) {

        String adminEmail = jwt.getSubject();

        AdminUserResponseDTO user =
                userService.updateUserStatus(
                        id,
                        statusDTO,
                        adminEmail
                );

        return ResponseEntity.ok(user);
    }
}
package com.bankease.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginResponseDTO {
    @NotBlank
private int id;
private String fullname;
private String email;
private String role;
private String status;
private String token;
}

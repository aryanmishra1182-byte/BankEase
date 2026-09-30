package com.bankease.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BillerRequestDTO {
    @NotBlank
    private String name;

    @NotBlank
    private String category;

//    @NotBlank
//    private String consumerNumber;
}
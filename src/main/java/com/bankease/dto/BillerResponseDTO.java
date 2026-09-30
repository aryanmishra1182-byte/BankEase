package com.bankease.dto;

import com.bankease.entity.BillerStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BillerResponseDTO {

    private Integer id;
    private String name;
    private String category;
//    private String consumerNumber;
    private BillerStatus status;
}
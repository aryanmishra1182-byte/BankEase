package com.bankease.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserResponseDTO {
  private  int id;
   private String fullname;
   private String phone;
   private String email;
  private  String role;
  private  String status;

}

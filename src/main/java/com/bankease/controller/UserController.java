package com.bankease.controller;

import com.bankease.dto.LoginRequestDTO;
import com.bankease.dto.LoginResponseDTO;
import com.bankease.dto.UserRequestDTO;
import com.bankease.dto.UserResponseDTO;
import com.bankease.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
   private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponseDTO>createUser(@Valid @RequestBody UserRequestDTO userRequest){
    UserResponseDTO savedUser=userService.saveUser(userRequest);
        return ResponseEntity.ok(savedUser);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO>userLogin(@Valid @RequestBody LoginRequestDTO loginRequest){
        LoginResponseDTO userLogged=userService.userLogin(loginRequest);
        return ResponseEntity.ok(userLogged);
    }

}

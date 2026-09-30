package com.bankease.service;

import com.bankease.dto.*;
import com.bankease.entity.AuditAction;
import com.bankease.exception.EmailAlreadyExistsException;
import com.bankease.exception.InvalidCredentialsException;
import com.bankease.exception.UserNotFoundException;
import com.bankease.repository.UserRepository;
import com.bankease.entity.Users;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;
private final JwtService jwtService;
    private final AuditLogService auditLogService;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuditLogService auditLogService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.auditLogService = auditLogService;
    }
    public UserResponseDTO saveUser(UserRequestDTO userRequest){
        Users user=new Users();

    if(userRepository.existsByEmail(userRequest.getEmail())){
        throw new EmailAlreadyExistsException(userRequest.getEmail());
    }
        user.setEmail(userRequest.getEmail());
        String encodedPassword= passwordEncoder.encode(userRequest.getPassword());
        user.setFullname(userRequest.getFullname());
        user.setPhone(userRequest.getPhone());
        user.setPassword(encodedPassword);
        user.setRole("CUSTOMER");
        user.setStatus("ACTIVE");
        Users savedUser=userRepository.save(user);
        return new UserResponseDTO(savedUser.getId()
                ,savedUser.getFullname()
                , savedUser.getPhone()
                ,savedUser.getEmail()
                , savedUser.getRole()
                ,savedUser.getStatus());
    }
public LoginResponseDTO userLogin(LoginRequestDTO loginRequest){
    Optional<Users> usersOptional=userRepository.findByEmail(loginRequest.getEmail());
if(usersOptional.isEmpty()){
    throw new InvalidCredentialsException("Invalid Email or password");
}
Users users=usersOptional.get();
if(!passwordEncoder.matches(loginRequest.getPassword(),users.getPassword())){
    throw new InvalidCredentialsException("Invalid Email or password");
}
if(!users.getStatus().equals("ACTIVE")){
    throw new InvalidCredentialsException("User is not active");
}
    String token = jwtService.generateToken(users);

return new LoginResponseDTO(users.getId(),users.getFullname(),users.getEmail(),users.getRole(),users.getStatus(),token);
}
    public List<AdminUserResponseDTO> getAllUsers() {

        List<Users> users = userRepository.findAll();

        return users.stream()
                .map(user -> new AdminUserResponseDTO(
                        user.getId(),
                        user.getFullname(),
                        user.getPhone(),
                        user.getEmail(),
                        user.getRole(),
                        user.getStatus()
                ))
                .toList();
    }
    public AdminUserResponseDTO getUserById(Integer id) {

        Users user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        return new AdminUserResponseDTO(
                user.getId(),
                user.getFullname(),
                user.getPhone(),
                user.getEmail(),
                user.getRole(),
                user.getStatus()
        );
    }
    @Transactional
    public AdminUserResponseDTO updateUserStatus(
            Integer id,
            UserStatusDTO statusDTO,
            String performedBy) {

        Users user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        String newStatus = statusDTO.getStatus();

        if (!newStatus.equals("ACTIVE") &&
                !newStatus.equals("INACTIVE")) {

            throw new IllegalArgumentException(
                    "Status must be ACTIVE or INACTIVE");
        }

        if (user.getStatus().equals(newStatus)) {
            throw new IllegalArgumentException(
                    "User is already in this status");
        }

        user.setStatus(newStatus);

        Users savedUser = userRepository.save(user);

        AuditAction action;

        if (newStatus.equals("ACTIVE")) {
            action = AuditAction.USER_ACTIVATED;
        } else {
            action = AuditAction.USER_DEACTIVATED;
        }

        auditLogService.log(
                action,
                performedBy,
                "USER",
                String.valueOf(savedUser.getId()),
                "User status changed to " + savedUser.getStatus()
        );

        return new AdminUserResponseDTO(
                savedUser.getId(),
                savedUser.getFullname(),
                savedUser.getPhone(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getStatus()
        );
    }

}

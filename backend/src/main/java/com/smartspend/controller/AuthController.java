package com.smartspend.controller;

import com.smartspend.dto.LoginRequest;
import com.smartspend.dto.LoginResponse;
import com.smartspend.dto.RegisterRequest;
import com.smartspend.entity.User;
import com.smartspend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(
                request.getFullName(),
                request.getEmail(),
                request.getPassword()
        );

        return ResponseEntity.ok(
                Map.of("message", "Registration successful")
        );
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        String token = authService.login(request);

        return ResponseEntity.ok(
                new LoginResponse(token)
        );
    }
}
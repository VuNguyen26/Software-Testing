package com.sgu.login.controller;

import com.sgu.login.dto.LoginRequest;
import com.sgu.login.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest body) {
        var token = authService.authenticate(body.username, body.password);
        return ResponseEntity.ok().body(java.util.Map.of("token", token));
    }
}
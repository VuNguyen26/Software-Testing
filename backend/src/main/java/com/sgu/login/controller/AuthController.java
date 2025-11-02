package com.sgu.login.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sgu.login.dto.LoginRequest;
import com.sgu.login.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest body) {
        // Dùng getter thay vì truy cập trực tiếp field private
        String token = authService.authenticate(body.getUsername(), body.getPassword());

        // Trả về JSON rõ ràng hơn, có cả message để test Integration
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đăng nhập thành công",
                "token", token
        ));
    }
}

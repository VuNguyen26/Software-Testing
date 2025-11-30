package com.sgu.login.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.sgu.login.model.User;
import com.sgu.login.repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String authenticate(String username, String password) {
        // 1. Validate
        validateInput(username, password);

        // 2. Kiểm tra user tồn tại (Logic nghiệp vụ)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Kiểm tra mật khẩu với BCrypt
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 4. Trả về token giả
        return "demo-token-" + user.getUsername();
    }

    public void validateInput(String username, String password) {
        // --- VALIDATE USERNAME ---
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (username.length() < 3) {
            throw new IllegalArgumentException("Username must be at least 3 characters long");
        }
        if (username.length() > 50) {
            throw new IllegalArgumentException("Username must be less than 50 characters long");
        }
        if (!username.matches("^[a-zA-Z0-9]*$")) {
            throw new IllegalArgumentException("Username must only contain letters and numbers");
        }

        // --- VALIDATE PASSWORD ---
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        if (password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }
        if (password.length() > 100) {
            throw new IllegalArgumentException("Password must be less than 100 characters long");
        }
        if (!password.matches(".*[a-zA-Z].*") || !password.matches(".*[0-9].*")) {
            throw new IllegalArgumentException("Password must contain both letters and numbers");
        }
    }
}
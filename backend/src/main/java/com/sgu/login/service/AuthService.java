package com.sgu.login.service;

import org.springframework.stereotype.Service;

import com.sgu.login.model.User;
import com.sgu.login.repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String authenticate(String username, String password) {
        // 1. Kiểm tra đầu vào rỗng
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        // 2. Kiểm tra user tồn tại
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Kiểm tra mật khẩu
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        // 4. Trả về token giả
        return "demo-token-" + user.getUsername();
    }
}

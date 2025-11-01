package com.sgu.login.service;

import com.sgu.login.model.User;
import com.sgu.login.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    public AuthService(UserRepository userRepository) { this.userRepository = userRepository; }

    public String authenticate(String username, String password) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        // demo token
        return "demo-token-" + user.getUsername();
    }
}
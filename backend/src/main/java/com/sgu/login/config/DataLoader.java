package com.sgu.login.config;

import com.sgu.login.model.User;
import com.sgu.login.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner init(UserRepository repo, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!repo.existsByUsername("admin")) {
                // Hash password before saving
                String hashedPassword = passwordEncoder.encode("Admin123");
                repo.save(new User("admin", hashedPassword));
            }
        };
    }
}
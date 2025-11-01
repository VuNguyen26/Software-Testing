package com.sgu.login.config;

import com.sgu.login.model.User;
import com.sgu.login.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner init(UserRepository repo) {
        return args -> {
            if (!repo.existsByUsername("admin")) {
                repo.save(new User("admin", "Admin123"));
            }
        };
    }
}
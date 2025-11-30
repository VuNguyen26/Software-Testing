package com.sgu.login;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.sgu.login.repository.UserRepository;
import com.sgu.login.service.AuthService;

public class ValidateInputTest {
    
    private AuthService createService() {
        UserRepository repo = Mockito.mock(UserRepository.class);
        PasswordEncoder encoder = Mockito.mock(PasswordEncoder.class);
        return new AuthService(repo, encoder);
    }

    @Test
    void validateInput_valid_username_and_password(){
        var svc = createService();
        assertDoesNotThrow(() -> svc.validateInput("admin", "Admin123"));
    }

    @Test
    void validateInput_empty_username(){
        var svc = createService();
        assertThrows(IllegalArgumentException.class, () -> svc.validateInput("", "Admin123"));
    }

    @Test
    void validateInput_short_username() {
        var svc = createService();
        assertThrows(IllegalArgumentException.class, () -> svc.validateInput("ab", "Admin123"));
    }

    @Test
    void validateInput_long_username() {
        var svc = createService();
        assertThrows(IllegalArgumentException.class, () -> svc.validateInput("a".repeat(51), "Admin123"));
    }

    @Test
    void validateInput_invalid_username_characters() {
        var svc = createService();
        assertThrows(IllegalArgumentException.class, () -> svc.validateInput("admin@123", "Admin123"));
    }

    @Test
    void validateInput_empty_password() {
        var svc = createService();
        assertThrows(IllegalArgumentException.class, () -> svc.validateInput("admin", ""));
    }

    @Test
    void validateInput_short_password() {
        var svc = createService();
        assertThrows(IllegalArgumentException.class, () -> svc.validateInput("admin", "abc"));
    }

    @Test
    void validateInput_long_password() {
        var svc = createService();
        assertThrows(IllegalArgumentException.class, () -> svc.validateInput("admin", "a".repeat(101)));
    }

    @Test
    void validateInput_password_without_letters() {
        var svc = createService();
        assertThrows(IllegalArgumentException.class, () -> svc.validateInput("admin", "123456"));
    }

    @Test
    void validateInput_password_without_numbers() {
        var svc = createService();
        assertThrows(IllegalArgumentException.class, () -> svc.validateInput("admin", "abcdef"));
    }

    @Test
    void validateInput_null_username() {
        var svc = createService();
        assertThrows(IllegalArgumentException.class, () -> svc.validateInput(null, "Admin123"));
    }

    @Test
    void validateInput_null_password() {
        var svc = createService();
        assertThrows(IllegalArgumentException.class, () -> svc.validateInput("admin", null));
    }
}

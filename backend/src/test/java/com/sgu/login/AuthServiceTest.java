package com.sgu.login;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sgu.login.model.User;
import com.sgu.login.repository.UserRepository;
import com.sgu.login.service.AuthService;

public class AuthServiceTest {

    @Test
    void login_success() {
        var repo = Mockito.mock(UserRepository.class);
        Mockito.when(repo.findByUsername("admin"))
                .thenReturn(Optional.of(new User("admin", "Admin123")));
        var svc = new AuthService(repo);

        String token = svc.authenticate("admin", "Admin123");

        assertNotNull(token);
        assertTrue(token.startsWith("demo-token-"));
    }

    @Test
    void login_wrong_password() {
        var repo = Mockito.mock(UserRepository.class);
        Mockito.when(repo.findByUsername("admin"))
                .thenReturn(Optional.of(new User("admin", "Admin123")));
        var svc = new AuthService(repo);

        assertThrows(RuntimeException.class, () -> svc.authenticate("admin", "x"));
    }

    @Test
    void login_user_not_found() {
        var repo = Mockito.mock(UserRepository.class);
        Mockito.when(repo.findByUsername("ghost")).thenReturn(Optional.empty());
        var svc = new AuthService(repo);

        assertThrows(RuntimeException.class, () -> svc.authenticate("ghost", "abc"));
    }

    @Test
    void login_empty_username() {
        var repo = Mockito.mock(UserRepository.class);
        var svc = new AuthService(repo);

        assertThrows(IllegalArgumentException.class, () -> svc.authenticate("", "abc"));
    }

    @Test
    void login_short_username() {
        var repo = Mockito.mock(UserRepository.class);
        var svc = new AuthService(repo);
        assertThrows(IllegalArgumentException.class, () -> svc.authenticate("a", "abc"));
    }

    @Test
    void login_long_username() {
        var repo = Mockito.mock(UserRepository.class);
        var svc = new AuthService(repo);
        assertThrows(IllegalArgumentException.class, () -> svc.authenticate("a".repeat(51), "abc"));
    }

    @Test
    void login_invalid_username() {
        var repo = Mockito.mock(UserRepository.class);
        var svc = new AuthService(repo);
        assertThrows(IllegalArgumentException.class, () -> svc.authenticate("admin@", "abc"));
    }

    @Test
    void login_empty_password() {
        var repo = Mockito.mock(UserRepository.class);
        var svc = new AuthService(repo);

        assertThrows(IllegalArgumentException.class, () -> svc.authenticate("admin", ""));
    }

    @Test
    void login_short_password() {
        var repo = Mockito.mock(UserRepository.class);
        var svc = new AuthService(repo);
        assertThrows(IllegalArgumentException.class, () -> svc.authenticate("admin", "a"));
    }

    @Test
    void login_long_password() {
        var repo = Mockito.mock(UserRepository.class);
        var svc = new AuthService(repo);
        assertThrows(IllegalArgumentException.class, () -> svc.authenticate("admin", "a".repeat(101)));
    }

    @Test
    void login_invalid_password() {
        var repo = Mockito.mock(UserRepository.class);
        var svc = new AuthService(repo);
        assertThrows(IllegalArgumentException.class, () -> svc.authenticate("admin", "admin"));
    }
}

package com.sgu.login;

import com.sgu.login.model.User;
import com.sgu.login.repository.UserRepository;
import com.sgu.login.service.AuthService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;

public class AuthServiceTest {
    @Test
    void login_success() {
        var repo = Mockito.mock(UserRepository.class);
        Mockito.when(repo.findByUsername("admin")).thenReturn(Optional.of(new User("admin","Admin123")));
        var svc = new AuthService(repo);
        String token = svc.authenticate("admin", "Admin123");
        assertTrue(token.startsWith("demo-token-"));
    }

    @Test
    void login_wrong_password() {
        var repo = Mockito.mock(UserRepository.class);
        Mockito.when(repo.findByUsername("admin")).thenReturn(Optional.of(new User("admin","Admin123")));
        var svc = new AuthService(repo);
        assertThrows(RuntimeException.class, () -> svc.authenticate("admin","x"));
    }
}
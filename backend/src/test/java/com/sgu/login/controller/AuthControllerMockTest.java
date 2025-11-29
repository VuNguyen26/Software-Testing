package com.sgu.login.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.never;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgu.login.dto.LoginRequest;
import com.sgu.login.service.AuthService;

@WebMvcTest(AuthController.class)
@DisplayName("AuthController Backend Mocking Tests")
public class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Mock: Controller với mocked service success")
    void testLoginWithMockedServiceSuccess() throws Exception {
        // Arrange: Setup mock behavior
        when(authService.authenticate(anyString(), anyString()))
                .thenReturn("mock-token-12345");

        LoginRequest request = new LoginRequest("testuser", "Pass123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công"))
                .andExpect(jsonPath("$.token").value("mock-token-12345"));
    }

    @Test
    @DisplayName("Mock: Controller với different credentials")
    void testLoginWithDifferentCredentials() throws Exception {
        // Mock trả về token khác cho user khác
        when(authService.authenticate(eq("admin"), eq("Admin123")))
                .thenReturn("admin-token-xyz");

        LoginRequest request = new LoginRequest("admin", "Admin123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("admin-token-xyz"));
    }

    @Test
    @DisplayName("Mock: Service không được gọi khi validation fails")
    void testServiceNotCalledWhenValidationFails() throws Exception {
        // Request không hợp lệ (username quá ngắn)
        LoginRequest invalidRequest = new LoginRequest("ab", "Pass123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        // Verify rằng service KHÔNG được gọi khi validation fail
        verify(authService, never()).authenticate(anyString(), anyString());
    }

    @Test
    @DisplayName("Verify: Service được gọi đúng 1 lần với tham số chính xác")
    void testVerifyServiceCalledOnce() throws Exception {
        when(authService.authenticate(anyString(), anyString()))
                .thenReturn("verify-token");

        LoginRequest request = new LoginRequest("verifyuser", "VerifyPass123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Verify service được gọi đúng 1 lần
        verify(authService, times(1)).authenticate(anyString(), anyString());
    }

    @Test
    @DisplayName("Verify: Service được gọi với tham số chính xác")
    void testVerifyServiceCalledWithCorrectParameters() throws Exception {
        when(authService.authenticate(anyString(), anyString()))
                .thenReturn("param-token");

        LoginRequest request = new LoginRequest("exactuser", "ExactPass123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Verify service được gọi với đúng username và password
        verify(authService, times(1)).authenticate(eq("exactuser"), eq("ExactPass123"));
    }

    @Test
    @DisplayName("Verify: Multiple requests call service multiple times")
    void testVerifyMultipleServiceCalls() throws Exception {
        when(authService.authenticate(anyString(), anyString()))
                .thenReturn("multi-token-1")
                .thenReturn("multi-token-2");

        LoginRequest request1 = new LoginRequest("user1", "Pass123");
        LoginRequest request2 = new LoginRequest("user2", "Pass456");

        // First request
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("multi-token-1"));

        // Second request
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("multi-token-2"));

        // Verify service được gọi 2 lần
        verify(authService, times(2)).authenticate(anyString(), anyString());
    }
}

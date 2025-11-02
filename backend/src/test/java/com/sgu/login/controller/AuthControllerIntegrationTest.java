package com.sgu.login.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.Mockito;
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
@DisplayName("AuthController Integration Tests")
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/auth/login - Success")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("admin", "Admin123");

        // Giả lập AuthService trả về token dạng chuỗi
        Mockito.when(authService.authenticate(anyString(), anyString()))
                .thenReturn("fake-token-123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").value("fake-token-123"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Validation failed")
    void testLoginValidationFail() throws Exception {
        // Username quá ngắn
        LoginRequest badRequest = new LoginRequest("a", "123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badRequest)))
                .andExpect(status().isBadRequest());
    }
}

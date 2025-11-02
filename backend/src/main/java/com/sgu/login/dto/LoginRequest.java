package com.sgu.login.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {

    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    // Constructor mặc định (cần cho Spring deserialization)
    public LoginRequest() {}

    // Constructor 2 tham số (cần cho test)
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getter & Setter
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

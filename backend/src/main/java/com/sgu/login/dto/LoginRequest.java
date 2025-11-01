package com.sgu.login.dto;

import jakarta.validation.constraints.*;

public class LoginRequest {
    @NotBlank @Size(min=3, max=50)
    public String username;

    @NotBlank @Size(min=6, max=100)
    public String password;
}
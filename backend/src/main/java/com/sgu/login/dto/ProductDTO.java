package com.sgu.login.dto;

import jakarta.validation.constraints.*;

public class ProductDTO {
    @NotBlank @Size(min=3, max=100)
    public String name;
    @Positive @Max(999999999)
    public long price;
    @Min(0) @Max(99999)
    public int quantity;
    @Size(max=500)
    public String description;
    @NotBlank
    public String category;
}
package com.sgu.login.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(min=3, max=100)
    private String name;

    @Positive @Max(999999999)
    private long price;

    @Min(0) @Max(99999)
    private int quantity;

    @Size(max=500)
    private String description;

    @NotBlank
    private String category;

    public Product() {}

    public Product(String name, long price, int quantity, String description, String category) {
        this.name = name; this.price = price; this.quantity = quantity; this.description = description; this.category = category;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public long getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setPrice(long price) { this.price = price; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
}
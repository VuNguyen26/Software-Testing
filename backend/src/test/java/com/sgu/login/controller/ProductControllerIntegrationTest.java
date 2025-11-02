package com.sgu.login.controller;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgu.login.model.Product;
import com.sgu.login.service.ProductService;

@WebMvcTest(ProductController.class)
@DisplayName("ProductController Integration Tests (with real methods from your project)")
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService service;

    @Autowired
    private ObjectMapper mapper;

    // GET /api/products
    @Test
    @DisplayName("GET /api/products → should return list")
    void testGetAllProducts() throws Exception {
        List<Product> products = List.of(
                new Product("Laptop", 15000000, 10, "High-end", "ELECTRONIC"),
                new Product("Ball", 100000, 5, "Football", "SPORT")
        );
        Mockito.when(service.getAll()).thenReturn(products);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Laptop"))
                .andExpect(jsonPath("$[1].category").value("SPORT"));
    }

    // POST /api/products
    @Test
    @DisplayName("POST /api/products → should create new product when token valid")
    void testCreateProductSuccess() throws Exception {
        Product req = new Product("Phone", 10000000, 3, "Smartphone", "ELECTRONIC");
        Product saved = new Product("Phone", 10000000, 3, "Smartphone", "ELECTRONIC");
        saved.setId(10L);

        Mockito.when(service.create(any(Product.class))).thenReturn(saved);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer demo-token-123")
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.name").value("Phone"));
    }

    // POST /api/products - không có token
    @Test
    @DisplayName("POST /api/products → should return 401 if missing Authorization header")
    void testCreateProductUnauthorized() throws Exception {
        Product req = new Product("Phone", 10000000, 3, "Smartphone", "ELECTRONIC");

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }
}

package com.sgu.login.controller;

import com.sgu.login.dto.ProductDTO;
import com.sgu.login.model.Product;
import com.sgu.login.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {
    private final ProductService service;
    public ProductController(ProductService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody ProductDTO dto, @RequestHeader(value="Authorization", required=false) String auth) {
        // demo auth check
        if (auth == null || !auth.startsWith("Bearer demo-token-")) {
            return ResponseEntity.status(401).build();
        }
        var p = new Product(dto.name, dto.price, dto.quantity, dto.description, dto.category);
        return ResponseEntity.ok(service.create(p));
    }

    @GetMapping
    public ResponseEntity<List<Product>> list() {
        return ResponseEntity.ok(service.all());
    }
}
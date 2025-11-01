package com.sgu.login.service;

import com.sgu.login.model.Product;
import com.sgu.login.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repo;
    public ProductService(ProductRepository repo) { this.repo = repo; }

    public Product create(Product p) { return repo.save(p); }
    public List<Product> all() { return repo.findAll(); }
}
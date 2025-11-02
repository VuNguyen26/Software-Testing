package com.sgu.login.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.sgu.login.model.Product;
import com.sgu.login.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    // === CREATE ===
    public Product create(Product p) {
        return repo.save(p);
    }

    // === READ (ALL) ===
    public List<Product> getAll() {
        return repo.findAll();
    }

    // === UPDATE ===
    public Product update(long id, Product newData) {
        Product existing = repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));
        existing.setName(newData.getName());
        existing.setPrice(newData.getPrice());
        existing.setQuantity(newData.getQuantity());
        existing.setDescription(newData.getDescription());
        existing.setCategory(newData.getCategory());
        return repo.save(existing);
    }

    // === DELETE ===
    public void delete(long id) {
        Product existing = repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));
        repo.delete(existing);
    }

    // === READ BY ID (nếu cần sau này) ===
    public Product getById(long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));
    }
}

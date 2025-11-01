package com.sgu.login;

import com.sgu.login.model.Product;
import com.sgu.login.repository.ProductRepository;
import com.sgu.login.service.ProductService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import static org.junit.jupiter.api.Assertions.*;

public class ProductServiceTest {
    @Test
    void create_saves() {
        var repo = Mockito.mock(ProductRepository.class);
        var svc = new ProductService(repo);
        var p = new Product("Ball", 1000, 1, "", "SPORT");
        Mockito.when(repo.save(Mockito.any())).thenAnswer(inv->inv.getArgument(0));
        var saved = svc.create(p);
        ArgumentCaptor<Product> cap = ArgumentCaptor.forClass(Product.class);
        Mockito.verify(repo).save(cap.capture());
        assertEquals("Ball", cap.getValue().getName());
        assertEquals(saved.getName(), "Ball");
    }
}
package com.sgu.login;

import com.sgu.login.model.Product;
import com.sgu.login.repository.ProductRepository;
import com.sgu.login.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class ProductServiceTest {

    private ProductRepository repo;
    private ProductService svc;

    @BeforeEach
    void setup() {
        repo = Mockito.mock(ProductRepository.class);
        svc = new ProductService(repo);
    }

    @Test
    void create_saves() {
        var p = new Product("Ball", 1000, 1, "", "SPORT");
        Mockito.when(repo.save(Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        var saved = svc.create(p);

        ArgumentCaptor<Product> cap = ArgumentCaptor.forClass(Product.class);
        Mockito.verify(repo).save(cap.capture());

        assertEquals("Ball", cap.getValue().getName());
        assertEquals("Ball", saved.getName());
    }

    @Test
    void get_all_returns_list() {
        var list = Arrays.asList(
                new Product("Ball", 1000, 1, "", "SPORT"),
                new Product("Shoe", 5000, 2, "", "SPORT")
        );
        Mockito.when(repo.findAll()).thenReturn(list);

        List<Product> result = svc.getAll();
        assertEquals(2, result.size());
    }

    @Test
    void update_existing_product() {
        var p = new Product("Ball", 1000, 1, "", "SPORT");
        Mockito.when(repo.findById(1L)).thenReturn(Optional.of(p));

        var update = new Product("Ball", 2000, 3, "", "SPORT");
        svc.update(1L, update);

        Mockito.verify(repo).findById(1L);
    }

    @Test
    void delete_existing_product() {
        var p = new Product("Ball", 1000, 1, "", "SPORT");
        Mockito.when(repo.findById(1L)).thenReturn(Optional.of(p));

        svc.delete(1L);
        Mockito.verify(repo).delete(p);
    }

    @Test
    void delete_not_found_throws() {
        Mockito.when(repo.findById(99L)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> svc.delete(99L));
    }

    @Test
    void update_not_found_throws() {
        var p = new Product("Ball", 2000, 3, "", "SPORT");
        Mockito.when(repo.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> svc.update(1L, p));
    }

    @Test
    void get_by_id_returns_product() {
        var p = new Product("Ball", 1000, 1, "", "SPORT");
        Mockito.when(repo.findById(1L)).thenReturn(Optional.of(p));

        Product result = svc.getById(1L);
        assertEquals("Ball", result.getName());
    }

    @Test
    void get_by_id_not_found_throws() {
        Mockito.when(repo.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> svc.getById(1L));
    }
}

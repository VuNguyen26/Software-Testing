package com.sgu.login.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sgu.login.model.Product;
import com.sgu.login.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService Backend Mocking Tests")
public class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = new Product("Laptop", 15000000, 10, "High-end laptop", "ELECTRONIC");
        testProduct.setId(1L);
    }

    @Test
    @DisplayName("Mock: Get product by ID - success")
    void testGetProductById() {
        when(productRepository.findById(1L))
                .thenReturn(Optional.of(testProduct));

        Product result = productService.getById(1L);

        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(15000000, result.getPrice());
        assertEquals(10, result.getQuantity());

        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Mock: Get product by ID - not found")
    void testGetProductByIdNotFound() {
        when(productRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> {
            productService.getById(99L);
        });

        verify(productRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("Mock: Get all products")
    void testGetAllProducts() {
        Product product2 = new Product("Mouse", 500000, 20, "Gaming mouse", "ELECTRONIC");
        product2.setId(2L);

        List<Product> mockProducts = List.of(testProduct, product2);

        when(productRepository.findAll()).thenReturn(mockProducts);

        List<Product> result = productService.getAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Laptop", result.get(0).getName());
        assertEquals("Mouse", result.get(1).getName());

        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Mock: Create product")
    void testCreateProduct() {
        Product newProduct = new Product("Keyboard", 1000000, 15, "Mechanical keyboard", "ELECTRONIC");
        Product savedProduct = new Product("Keyboard", 1000000, 15, "Mechanical keyboard", "ELECTRONIC");
        savedProduct.setId(3L);

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = productService.create(newProduct);

        assertNotNull(result);
        assertEquals(3L, result.getId());
        assertEquals("Keyboard", result.getName());
        assertEquals(1000000, result.getPrice());

        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Mock: Update product - success")
    void testUpdateProduct() {
        Product updateData = new Product("Updated Laptop", 20000000, 5, "Premium laptop", "ELECTRONIC");
        Product updatedProduct = new Product("Updated Laptop", 20000000, 5, "Premium laptop", "ELECTRONIC");
        updatedProduct.setId(1L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        Product result = productService.update(1L, updateData);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Updated Laptop", result.getName());
        assertEquals(20000000, result.getPrice());
        assertEquals(5, result.getQuantity());

        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Mock: Update product - not found")
    void testUpdateProductNotFound() {
        Product updateData = new Product("Updated Product", 10000000, 5, "Description", "CATEGORY");

        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> {
            productService.update(99L, updateData);
        });

        verify(productRepository, times(1)).findById(99L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("Mock: Delete product - success")
    void testDeleteProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        productService.delete(1L);

        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).delete(testProduct);
    }

    @Test
    @DisplayName("Mock: Delete product - not found")
    void testDeleteProductNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> {
            productService.delete(99L);
        });

        verify(productRepository, times(1)).findById(99L);
        verify(productRepository, never()).delete(any(Product.class));
    }

    @Test
    @DisplayName("Verify: Repository findById called with correct parameter")
    void testVerifyFindByIdParameter() {
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(testProduct));

        productService.getById(5L);

        verify(productRepository, times(1)).findById(5L);
    }

    @Test
    @DisplayName("Verify: Repository save called when creating product")
    void testVerifySaveCalledOnCreate() {
        Product newProduct = new Product("Monitor", 3000000, 8, "4K Monitor", "ELECTRONIC");
        
        when(productRepository.save(newProduct)).thenReturn(newProduct);

        productService.create(newProduct);

        verify(productRepository, times(1)).save(newProduct);
    }

    @Test
    @DisplayName("Verify: Multiple repository interactions")
    void testVerifyMultipleInteractions() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.findById(2L)).thenReturn(Optional.of(testProduct));

        productService.getById(1L);
        productService.getById(2L);

        verify(productRepository, times(2)).findById(anyLong());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).findById(2L);
    }
}

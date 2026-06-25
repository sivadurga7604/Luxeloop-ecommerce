package com.ecommerce.controller;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductRepository repo;

    // PUBLIC: Everyone can see products
    @GetMapping
    public List<Product> getAll() {
        return repo.findAll();
    }

    // SECURED: Only ADMIN can add
    @PostMapping
    public ResponseEntity<?> add(@RequestBody Product p, @RequestHeader(value = "role", defaultValue = "CUSTOMER") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        return ResponseEntity.ok(repo.save(p));
    }

    // SECURED: Only ADMIN can update
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Product p, @RequestHeader(value = "role", defaultValue = "CUSTOMER") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        p.setId(id);
        return ResponseEntity.ok(repo.save(p));
    }

    // SECURED: Only ADMIN can delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader(value = "role", defaultValue = "CUSTOMER") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        repo.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }
}
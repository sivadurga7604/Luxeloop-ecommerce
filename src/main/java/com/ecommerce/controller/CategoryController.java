package com.ecommerce.controller;

import com.ecommerce.entity.Category;
import com.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository repo;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Category> categories = repo.findAll();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/seed")
    public ResponseEntity<?> seed() {
        try {

            if (repo.count() == 0) {

                Category men = new Category();
                men.setName("Men");
                repo.save(men);

                Category women = new Category();
                women.setName("Women");
                repo.save(women);

                Category electronics = new Category();
                electronics.setName("Electronics");
                repo.save(electronics);

                Category accessories = new Category();
                accessories.setName("Accessories");
                repo.save(accessories);

                return ResponseEntity.ok("Categories added successfully");
            }

            return ResponseEntity.ok("Categories already exist");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
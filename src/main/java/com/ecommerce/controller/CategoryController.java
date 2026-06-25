package com.ecommerce.controller;

import com.ecommerce.entity.Category;
import com.ecommerce.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin("*")
public class CategoryController {
    @Autowired
    private CategoryRepository repo;

    @GetMapping
    public List<Category> getAll() { return repo.findAll(); }

    // Use this URL once after deployment to fix your empty categories
    @GetMapping("/seed")
    public String seed() {
        if (repo.count() == 0) {
            repo.save(new Category("Men"));
            repo.save(new Category("Women"));
            repo.save(new Category("Electronics"));
            return "SUCCESS: Categories added!";
        }
        return "Already exists.";
    }
}
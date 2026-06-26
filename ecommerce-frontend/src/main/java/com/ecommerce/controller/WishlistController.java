package com.ecommerce.controller;

import com.ecommerce.entity.Wishlist;
import com.ecommerce.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin("*")
public class WishlistController {

    @Autowired
    private WishlistRepository repo;

    // Add item to wishlist
    @PostMapping("/add")
    public Wishlist add(@RequestBody Wishlist item) {
        return repo.save(item);
    }

    // Get all wishlist items for a user
    @GetMapping("/{userId}")
    public List<Wishlist> getWishlist(@PathVariable Long userId) {
        return repo.findByUserId(userId);
    }

    // Remove item from wishlist
    @Transactional
    @DeleteMapping("/{userId}/{productId}")
    public void remove(@PathVariable Long userId,
                       @PathVariable Long productId) {
        repo.deleteByUserIdAndProductId(userId, productId);
    }
}
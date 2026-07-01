package com.ecommerce.controller;

import com.ecommerce.entity.Wishlist;
import com.ecommerce.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin("*")
public class WishlistController {

    @Autowired
    private WishlistRepository repo;

    @PostMapping("/add")
    public Wishlist add(@RequestBody Wishlist item) {
        return repo.save(item);
    }

    @GetMapping("/{userId}")
    public List<Wishlist> getWishlist(@PathVariable Long userId) {
        return repo.findByUserId(userId);
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<String> remove(@PathVariable Long userId, @PathVariable Long productId) {
        repo.deleteByUserIdAndProductId(userId, productId);
        return ResponseEntity.ok("Item removed from wishlist");
    }
}
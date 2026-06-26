package com.ecommerce.controller;

import com.ecommerce.entity.Wishlist;
import com.ecommerce.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin("*")
public class WishlistController {

    @Autowired
    private WishlistService service;

    @PostMapping("/add")
    public Wishlist add(@RequestBody Wishlist item) {
        return service.add(item);
    }

    @GetMapping("/{userId}")
    public List<Wishlist> getWishlist(@PathVariable Long userId) {
        return service.getWishlist(userId);
    }

    @DeleteMapping("/{userId}/{productId}")
    public void remove(@PathVariable Long userId,
                       @PathVariable Long productId) {
        service.remove(userId, productId);
    }
}
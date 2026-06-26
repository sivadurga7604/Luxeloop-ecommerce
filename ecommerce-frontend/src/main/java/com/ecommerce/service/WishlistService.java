package com.ecommerce.service;

import com.ecommerce.entity.Wishlist;
import com.ecommerce.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository repo;

    public Wishlist add(Wishlist item) {
        return repo.save(item);
    }

    public List<Wishlist> getWishlist(Long userId) {
        return repo.findByUserId(userId);
    }

    @Transactional
    public void remove(Long userId, Long productId) {
        Wishlist item = repo.findByUserIdAndProductId(userId, productId);

        if (item != null) {
            repo.delete(item);
        }
    }
}
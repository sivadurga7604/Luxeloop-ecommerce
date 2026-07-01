package com.ecommerce.repository;

import com.ecommerce.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUserId(Long userId);

    Wishlist findByUserIdAndProductId(Long userId, Long productId);

    @Modifying
    @Transactional
    void deleteByUserIdAndProductId(Long userId, Long productId);
}
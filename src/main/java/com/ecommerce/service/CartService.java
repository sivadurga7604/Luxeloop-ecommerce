package com.ecommerce.service;

import com.ecommerce.entity.CartItem;
import java.util.List;

public interface CartService {
    CartItem addToCart(CartItem item);
    List<CartItem> getCartByUser(Long userId);
    CartItem updateCartItem(Long id, Integer quantity);
    void removeItem(Long id);
    void clearCart(Long userId);
}
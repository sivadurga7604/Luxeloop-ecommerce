package com.ecommerce.service.impl;

import com.ecommerce.entity.CartItem;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Override
    public CartItem addToCart(CartItem item) {
        return cartRepository.save(item);
    }

    @Override
    public List<CartItem> getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    @Override
    public CartItem updateCartItem(Long id, Integer quantity) {
        CartItem item = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        return cartRepository.save(item);
    }

    @Override
    public void removeItem(Long id) {
        cartRepository.deleteById(id);
    }

    @Override
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
}
package com.ecommerce.service.impl;

import com.ecommerce.entity.Order;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository repo;

    @Override
    public Order placeOrder(Order order) {
        // FIX: always set status to SUCCESS only
        order.setStatus("SUCCESS");
        // FIX: always set current date
        order.setOrderDate(LocalDateTime.now());
        return repo.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return repo.findAll();
    }

    public List<Order> getOrders(Long userId) {
        if (userId == null) return repo.findAll();
        return repo.findByUserId(userId);
    }
}
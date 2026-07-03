package com.ecommerce.controller;

import com.ecommerce.entity.Order;
import com.ecommerce.service.impl.OrderServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    OrderServiceImpl orderService;

    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        // FIX: set status to SUCCESS if not already set
        if (order.getStatus() == null) {
            order.setStatus("SUCCESS");
        }
        return orderService.placeOrder(order);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrders(userId);
    }
}
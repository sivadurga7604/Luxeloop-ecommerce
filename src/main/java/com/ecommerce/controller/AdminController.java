package com.ecommerce.controller;

import com.ecommerce.entity.Order;
import com.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    OrderRepository orderRepository;

    @GetMapping("/analytics")
    public Map<String, Object> analytics() {
        double revenue = orderRepository.findAll()
                .stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();

        Map<String, Object> map = new HashMap<>();
        map.put("totalOrders", orderRepository.count());
        map.put("revenue", revenue);
        return map;
    }
}
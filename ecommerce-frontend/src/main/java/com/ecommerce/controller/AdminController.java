package com.ecommerce.controller;

import com.ecommerce.entity.Order;
import com.ecommerce.service.ProductService; // Ensure this exists
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ProductService productService;

    @GetMapping("/analytics")
    public Map<String, Object> analytics() {
        double revenue = orderRepository.findAll().stream().mapToDouble(Order::getTotalAmount).sum();
        Map<String, Object> map = new HashMap<>();
        map.put("totalOrders", orderRepository.count());
        map.put("revenue", revenue);
        return map;
    }

    @PostMapping("/products/add")
    public String addProduct(@RequestParam("file") MultipartFile file,
                             @RequestParam("name") String name,
                             @RequestParam("price") double price,
                             @RequestParam("categoryId") Long categoryId) {
        productService.saveProduct(file, name, price, categoryId);
        return "Product saved successfully";
    }
}
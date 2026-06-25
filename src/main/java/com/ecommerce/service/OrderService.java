package com.ecommerce.service;

import com.ecommerce.entity.Order;
import java.util.List;

public interface OrderService {

    Order placeOrder(Order order);

    List<Order> getAllOrders();
}
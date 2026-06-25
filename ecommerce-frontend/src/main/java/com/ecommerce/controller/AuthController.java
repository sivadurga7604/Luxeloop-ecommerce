package com.ecommerce.controller;

import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {

        User dbUser = userRepository.findByEmail(user.getEmail());

        if (dbUser != null && dbUser.getPassword().equals(user.getPassword())) {
            Map<String, Object> response = new HashMap<>();

            response.put("token", "user-" + dbUser.getId());
            response.put("userId", dbUser.getId());
            response.put("name", dbUser.getName());

            // Logic: Force ADMIN for your specific email, otherwise use DB role
            if ("sivadurgas7604@gmail.com".equalsIgnoreCase(dbUser.getEmail())) {
                response.put("role", "ADMIN");
            } else {
                response.put("role", dbUser.getRole() != null ? dbUser.getRole() : "CUSTOMER");
            }

            return response;
        }

        throw new RuntimeException("Invalid credentials");
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        user.setRole("CUSTOMER");
        return userRepository.save(user);
    }

    @GetMapping("/make-admin")
    public String makeAdmin() {
        User user = userRepository.findByEmail("sivadurgas7604@gmail.com");

        if (user == null) {
            return "User not found";
        }

        user.setRole("ADMIN");
        userRepository.save(user);

        return "Admin updated successfully";
    }
}
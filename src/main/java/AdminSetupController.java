package com.ecommerce.controller;

import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class AdminSetupController {

    @Autowired
    private UserRepository userRepository;

    // One-time setup endpoint to make a user ADMIN
    @GetMapping("/setup/make-admin/{email}")
    public String makeAdmin(@PathVariable String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setRole("ADMIN");
            userRepository.save(user);
            return "User " + email + " is now ADMIN";
        }
        return "User not found";
    }

    // Fix all users without role
    @GetMapping("/setup/fix-roles")
    public String fixRoles() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("CUSTOMER");
                userRepository.save(user);
            }
        }
        return "All roles fixed - " + users.size() + " users updated";
    }
}
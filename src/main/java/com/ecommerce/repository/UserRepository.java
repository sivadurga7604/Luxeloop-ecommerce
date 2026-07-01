package com.ecommerce.repository;

import com.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Make sure to import this

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    // Add this method to resolve the error
    Optional<User> findByEmailAndPassword(String email, String password);
}
package com.docsio.backend.controller;

import com.docsio.backend.domain.User;
import com.docsio.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAll() {
        return userService.findAll();
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.save(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    //login and register logic

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(java.time.LocalDateTime.now());
        return ResponseEntity.ok(userService.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User user = userService.findByUsername(loginRequest.getUsername());

        System.out.println("Found user: " + user);
        System.out.println("Raw password: " + loginRequest.getPassword());
        System.out.println("Stored hash: " + user.getPassword());
        System.out.println("Matches: " + passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()));

        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.findById(id);
        if (user == null) return ResponseEntity.notFound().build();
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        return ResponseEntity.ok(userService.save(user));
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        User user = userService.findById(id);
        if (user == null) return ResponseEntity.notFound().build();
        if (!passwordEncoder.matches(body.get("currentPassword"), user.getPassword())) {
            return ResponseEntity.status(401).body("Wrong current password");
        }
        user.setPassword(passwordEncoder.encode(body.get("newPassword")));
        userService.save(user);
        return ResponseEntity.ok().build();
    }

}

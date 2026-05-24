package com.docsio.backend.service;

import com.docsio.backend.domain.User;
import java.util.List;

public interface UserService {
    User save(User user);
    List<User> findAll();
    void delete(Long id);

    User findByUsername(String username);

    User findById(Long id);
}

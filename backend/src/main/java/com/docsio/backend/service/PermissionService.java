package com.docsio.backend.service;

import com.docsio.backend.domain.UserPermission;

import java.util.List;

public interface PermissionService {
    UserPermission grant(UserPermission permission);
    List<UserPermission> findByUser(Long userId);
    List<UserPermission> findByDocument(Long documentId);
    void revoke(Long id);
    UserPermission findById(Long id);
    List<UserPermission> findAll();
}

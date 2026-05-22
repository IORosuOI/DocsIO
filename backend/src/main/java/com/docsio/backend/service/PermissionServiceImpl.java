package com.docsio.backend.service;

import com.docsio.backend.domain.UserPermission;
import com.docsio.backend.repository.PermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionServiceImpl implements PermissionService {
    private final PermissionRepository permissionRepository;

    public PermissionServiceImpl(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @Override
    public UserPermission grant(UserPermission permission) { return permissionRepository.save(permission); }

    @Override
    public List<UserPermission> findByUser(Long userId) { return permissionRepository.findByUserId(userId); }

    @Override
    public List<UserPermission> findByDocument(Long documentId) { return permissionRepository.findByDocumentId(documentId); }
}

package com.docsio.backend.repository;

import com.docsio.backend.domain.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermissionRepository extends JpaRepository<UserPermission, Long> {
    List<UserPermission> findByUserId(Long userId);
    List<UserPermission> findByDocumentId(Long documentId);
}
package com.docsio.backend.controller;

import com.docsio.backend.domain.UserPermission;
import com.docsio.backend.service.PermissionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @PostMapping
    public UserPermission grant(@RequestBody UserPermission permission) {
        return permissionService.grant(permission);
    }

    @GetMapping("/user/{userId}")
    public List<UserPermission> getByUser(@PathVariable Long userId) {
        return permissionService.findByUser(userId);
    }

    @GetMapping("/document/{documentId}")
    public List<UserPermission> getByDocument(@PathVariable Long documentId) {
        return permissionService.findByDocument(documentId);
    }
}
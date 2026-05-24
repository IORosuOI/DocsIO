package com.docsio.backend.controller;

import com.docsio.backend.domain.AccessLevel;
import com.docsio.backend.domain.Document;
import com.docsio.backend.domain.User;
import com.docsio.backend.domain.UserPermission;
import com.docsio.backend.service.DocumentService;
import com.docsio.backend.service.PermissionService;
import com.docsio.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    private final UserService userService;
    private final DocumentService documentService;
    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService, UserService userService, DocumentService documentService) {
        this.permissionService = permissionService;
        this.userService = userService;
        this.documentService = documentService;
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

    @PostMapping("/share")
    public ResponseEntity<?> shareByUsername(@RequestBody java.util.Map<String, String> body) {
        String username = body.get("username");
        Long documentId = Long.parseLong(body.get("documentId"));
        String accessLevel = body.get("accessLevel");

        User recipient = userService.findByUsername(username);
        if (recipient == null) return ResponseEntity.status(404).body("User not found");

        Document doc = documentService.findById(documentId);

        if (doc.getOwner().getId().equals(recipient.getId())) {
            return ResponseEntity.status(400).body("Cannot share with yourself");
        }

        List<UserPermission> existing = permissionService.findByDocument(documentId);
        boolean alreadyShared = existing.stream()
                .anyMatch(p -> p.getUser().getId().equals(recipient.getId()));
        if (alreadyShared) {
            return ResponseEntity.status(400).body("Already shared with this user");
        }

        UserPermission permission = new UserPermission();
        permission.setUser(recipient);
        permission.setDocument(doc);
        permission.setAccessLevel(AccessLevel.valueOf(accessLevel));

        return ResponseEntity.ok(permissionService.grant(permission));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> revoke(@PathVariable Long id,
                                    @RequestHeader("X-User-Id") Long userId) {
        UserPermission perm = permissionService.findById(id);
        if (perm == null) return ResponseEntity.notFound().build();

        boolean isDocOwner = perm.getDocument().getOwner().getId().equals(userId);
        boolean isSelf = perm.getUser().getId().equals(userId);

        if (!isDocOwner && !isSelf) {
            return ResponseEntity.status(403).body("Not authorized");
        }

        permissionService.revoke(id);
        return ResponseEntity.noContent().build();
    }
}
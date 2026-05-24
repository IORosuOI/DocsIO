package com.docsio.backend.controller;

import com.docsio.backend.domain.Document;
import com.docsio.backend.domain.Folder;
import com.docsio.backend.domain.UserPermission;
import com.docsio.backend.domain.AccessLevel;
import com.docsio.backend.service.DocumentService;
import com.docsio.backend.service.FolderService;
import com.docsio.backend.service.PermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderService folderService;
    private final DocumentService documentService;
    private final PermissionService permissionService;

    public FolderController(FolderService folderService, DocumentService documentService, PermissionService permissionService) {
        this.folderService = folderService;
        this.documentService = documentService;
        this.permissionService = permissionService;
    }

    @GetMapping
    public List<Folder> getAll() {
        return folderService.findAll();
    }

    @GetMapping("/owner/{ownerId}")
    public List<Folder> getByOwner(@PathVariable Long ownerId) {
        return folderService.findByOwner(ownerId);
    }

    @GetMapping("/{id}/children")
    public List<Folder> getChildren(@PathVariable Long id) {
        return folderService.findByParent(id);
    }

    @GetMapping("/{id}/documents")
    public List<Document> getDocuments(@PathVariable Long id) {
        return documentService.findByFolder(id);
    }

    @PostMapping
    public Folder create(@RequestBody Folder folder) {
        return folderService.save(folder);
    }

    @PutMapping("/{id}")
    public Folder update(@PathVariable Long id, @RequestBody Folder folder) {
        return folderService.update(id, folder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        folderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<?> shareFolder(@PathVariable Long id,
                                         @RequestBody java.util.Map<String, String> body) {
        List<Document> docs = documentService.findByFolder(id);
        String username = body.get("username");
        String accessLevel = body.get("accessLevel");

        com.docsio.backend.domain.User recipient =
                permissionService.findAll().stream()
                        .filter(p -> p.getUser().getUsername().equals(username))
                        .map(p -> p.getUser())
                        .findFirst().orElse(null);

        if (recipient == null) return ResponseEntity.status(404).body("User not found");

        for (Document doc : docs) {
            UserPermission perm = new UserPermission();
            perm.setUser(recipient);
            perm.setDocument(doc);
            perm.setAccessLevel(AccessLevel.valueOf(accessLevel));
            permissionService.grant(perm);
        }

        return ResponseEntity.ok().build();
    }
}
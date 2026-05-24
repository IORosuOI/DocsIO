package com.docsio.backend.controller;

import com.docsio.backend.domain.AccessLevel;
import com.docsio.backend.domain.Document;
import com.docsio.backend.domain.Folder;
import com.docsio.backend.domain.UserPermission;
import com.docsio.backend.service.DocumentService;
import com.docsio.backend.service.FolderService;
import com.docsio.backend.service.PermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final PermissionService permissionService;
    private final FolderService folderService;

    public DocumentController(DocumentService documentService, PermissionService permissionService, FolderService folderService) {
        this.documentService = documentService;
        this.permissionService = permissionService;
        this.folderService = folderService;
    }

    @GetMapping("/owner/{ownerId}")
    public List<Document> getByOwner(@PathVariable Long ownerId) {
        return documentService.findByOwner(ownerId);
    }

    @GetMapping("/search")
    public List<Document> search(@RequestParam String keyword) {
        return documentService.search(keyword);
    }

    @GetMapping("/{id}")
    public Document getById(@PathVariable Long id) {
        return documentService.findById(id);
    }

    @PostMapping
    public Document create(@RequestBody Document document) {
        document.setCreatedAt(java.time.LocalDateTime.now());
        document.setLastModified(java.time.LocalDateTime.now());
        return documentService.save(document);
    }

    private boolean isOwner(Document doc, Long userId) {
        return doc.getOwner() != null && doc.getOwner().getId().equals(userId);
    }

    private boolean hasPermission(Long documentId, Long userId, AccessLevel required) {
        List<UserPermission> perms = permissionService.findByDocument(documentId);
        return perms.stream().anyMatch(p ->
                p.getUser().getId().equals(userId) &&
                        (p.getAccessLevel() == required || p.getAccessLevel() == AccessLevel.EDIT)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Document document,
                                    @RequestHeader("X-User-Id") Long userId) {
        Document existing = documentService.findById(id);
        if (!isOwner(existing, userId) && !hasPermission(id, userId, AccessLevel.EDIT)) {
            return ResponseEntity.status(403).body("No edit permission");
        }
        document.setLastModified(java.time.LocalDateTime.now());
        return ResponseEntity.ok(documentService.update(id, document));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                    @RequestHeader("X-User-Id") Long userId) {
        Document existing = documentService.findById(id);
        if (!isOwner(existing, userId)) {
            return ResponseEntity.status(403).body("Only the owner can delete");
        }
        documentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/move/{folderId}")
    public ResponseEntity<?> moveToFolder(@PathVariable Long id, @PathVariable Long folderId) {
        Document doc = documentService.findById(id);
        Folder folder = folderService.findById(folderId);
        doc.setFolder(folder);
        return ResponseEntity.ok(documentService.save(doc));
    }

    @PutMapping("/{id}/remove-from-folder")
    public ResponseEntity<?> removeFromFolder(@PathVariable Long id) {
        Document doc = documentService.findById(id);
        doc.setFolder(null);
        return ResponseEntity.ok(documentService.save(doc));
    }
}
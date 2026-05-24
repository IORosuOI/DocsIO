package com.docsio.backend.controller;

import com.docsio.backend.domain.Document;
import com.docsio.backend.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
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

    @PutMapping("/{id}")
    public Document update(@PathVariable Long id, @RequestBody Document document) {
        document.setLastModified(java.time.LocalDateTime.now());
        return documentService.update(id, document);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
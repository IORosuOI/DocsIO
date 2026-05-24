package com.docsio.backend.controller;

import com.docsio.backend.domain.DocumentVersion;
import com.docsio.backend.service.DocumentVersionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/versions")
public class DocumentVersionController {

    private final DocumentVersionService documentVersionService;

    public DocumentVersionController(DocumentVersionService documentVersionService) {
        this.documentVersionService = documentVersionService;
    }

    @GetMapping("/document/{documentId}")
    public List<DocumentVersion> getByDocument(@PathVariable Long documentId) {
        return documentVersionService.findByDocument(documentId);
    }

    @PostMapping
    public ResponseEntity<DocumentVersion> saveVersion(@RequestBody Map<String, Object> body) {
        DocumentVersion version = new DocumentVersion();
        version.setDocumentId(Long.valueOf(body.get("documentId").toString()));
        version.setTitle(body.get("title") != null ? body.get("title").toString() : "Untitled");
        version.setContent(body.get("content") != null ? body.get("content").toString() : "");
        version.setVersionLabel(body.get("versionLabel") != null ? body.get("versionLabel").toString() : "v1");
        version.setSavedAt(LocalDateTime.now());
        return ResponseEntity.ok(documentVersionService.save(version));
    }
}

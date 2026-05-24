package com.docsio.backend.controller;

import com.docsio.backend.domain.Document;
import com.docsio.backend.repository.DocumentRepository;
import com.docsio.backend.repository.DocumentVersionRepository;
import com.docsio.backend.repository.PermissionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final DocumentRepository documentRepository;
    private final DocumentVersionRepository documentVersionRepository;
    private final PermissionRepository permissionRepository;

    public AnalyticsController(DocumentRepository documentRepository,
                               DocumentVersionRepository documentVersionRepository,
                               PermissionRepository permissionRepository) {
        this.documentRepository = documentRepository;
        this.documentVersionRepository = documentVersionRepository;
        this.permissionRepository = permissionRepository;
    }

    @GetMapping("/user/{userId}")
    public Map<String, Object> getAnalytics(@PathVariable Long userId) {
        List<Document> activeDocs = documentRepository.findByOwnerId(userId).stream()
                .filter(d -> !Boolean.TRUE.equals(d.getDeleted()))
                .collect(Collectors.toList());

        long totalDocuments = activeDocs.size();

        long totalVersions = activeDocs.stream()
                .mapToLong(d -> documentVersionRepository.findByDocumentIdOrderBySavedAtDesc(d.getId()).size())
                .sum();

        long documentsInFolders = activeDocs.stream()
                .filter(d -> d.getFolder() != null)
                .count();

        long sharedDocuments = activeDocs.stream()
                .mapToLong(d -> permissionRepository.findByDocumentId(d.getId()).size())
                .sum();

        List<Map<String, Object>> mostEditedDocs = activeDocs.stream()
                .filter(d -> d.getLastModified() != null)
                .sorted(Comparator.comparing(Document::getLastModified).reversed())
                .limit(5)
                .map(d -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", d.getId());
                    m.put("title", d.getTitle());
                    m.put("lastModified", d.getLastModified());
                    return m;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> recentActivity = activeDocs.stream()
                .filter(d -> d.getLastModified() != null)
                .sorted(Comparator.comparing(Document::getLastModified).reversed())
                .limit(10)
                .map(d -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", d.getId());
                    m.put("title", d.getTitle());
                    m.put("lastModified", d.getLastModified());
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalDocuments", totalDocuments);
        result.put("totalVersions", totalVersions);
        result.put("documentsInFolders", documentsInFolders);
        result.put("sharedDocuments", sharedDocuments);
        result.put("mostEditedDocs", mostEditedDocs);
        result.put("recentActivity", recentActivity);

        return result;
    }
}

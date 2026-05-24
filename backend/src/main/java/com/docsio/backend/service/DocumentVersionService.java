package com.docsio.backend.service;

import com.docsio.backend.domain.DocumentVersion;

import java.util.List;

public interface DocumentVersionService {
    DocumentVersion save(DocumentVersion version);
    List<DocumentVersion> findByDocument(Long documentId);
}

package com.docsio.backend.service;

import com.docsio.backend.domain.DocumentVersion;
import com.docsio.backend.repository.DocumentVersionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentVersionServiceImpl implements DocumentVersionService {

    private final DocumentVersionRepository documentVersionRepository;

    public DocumentVersionServiceImpl(DocumentVersionRepository documentVersionRepository) {
        this.documentVersionRepository = documentVersionRepository;
    }

    @Override
    public DocumentVersion save(DocumentVersion version) {
        return documentVersionRepository.save(version);
    }

    @Override
    public List<DocumentVersion> findByDocument(Long documentId) {
        return documentVersionRepository.findByDocumentIdOrderBySavedAtDesc(documentId);
    }
}

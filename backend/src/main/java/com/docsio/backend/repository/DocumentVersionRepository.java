package com.docsio.backend.repository;

import com.docsio.backend.domain.DocumentVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentVersionRepository extends JpaRepository<DocumentVersion, Long> {
    List<DocumentVersion> findByDocumentIdOrderBySavedAtDesc(Long documentId);
}

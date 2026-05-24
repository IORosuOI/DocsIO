package com.docsio.backend.repository;

import com.docsio.backend.domain.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByOwnerId(Long ownerId);
    List<Document> findByTitleContainingIgnoreCase(String keyword);
    List<Document> findByFolderId(Long folderId);
}
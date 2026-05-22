package com.docsio.backend.service;

import com.docsio.backend.domain.Document;

import java.util.List;

public interface DocumentService {
    Document save(Document document);
    List<Document> findByOwner(Long ownerId);
    List<Document> search(String keyword);
    void delete(Long id);
    Document findById(Long id);
    Document update(Long id, Document updated);
}
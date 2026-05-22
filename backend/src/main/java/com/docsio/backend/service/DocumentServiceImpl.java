package com.docsio.backend.service;

import com.docsio.backend.domain.Document;
import com.docsio.backend.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService {
    private final DocumentRepository documentRepository;

    public DocumentServiceImpl(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @Override
    public Document save(Document document) { return documentRepository.save(document); }

    @Override
    public List<Document> findByOwner(Long ownerId) { return documentRepository.findByOwnerId(ownerId); }

    @Override
    public List<Document> search(String keyword) { return documentRepository.findByTitleContainingIgnoreCase(keyword); }

    @Override
    public void delete(Long id) { documentRepository.deleteById(id); }

    @Override
    public Document findById(Long id) { return documentRepository.findById(id).orElseThrow(); }

    @Override
    public Document update(Long id, Document updated) {
        Document doc = documentRepository.findById(id).orElseThrow();
        doc.setTitle(updated.getTitle());
        doc.setContent(updated.getContent());
        doc.setPinned(updated.getPinned());
        return documentRepository.save(doc);
    }
}

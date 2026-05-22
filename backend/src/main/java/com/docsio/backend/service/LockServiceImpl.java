package com.docsio.backend.service;

import com.docsio.backend.domain.DocLock;
import com.docsio.backend.repository.LockRepository;
import org.springframework.stereotype.Service;

@Service
public class LockServiceImpl implements LockService {
    private final LockRepository lockRepository;

    public LockServiceImpl(LockRepository lockRepository) {
        this.lockRepository = lockRepository;
    }

    @Override
    public DocLock getLockState(Long documentId) { return lockRepository.findByDocumentId(documentId).orElseThrow(); }

    @Override
    public DocLock save(DocLock lock) { return lockRepository.save(lock); }
}
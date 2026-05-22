package com.docsio.backend.service;

import com.docsio.backend.domain.DocLock;

public interface LockService {
    DocLock getLockState(Long documentId);
    DocLock save(DocLock lock);
}

package com.docsio.backend.repository;

import com.docsio.backend.domain.DocLock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LockRepository extends JpaRepository<DocLock, Long> {
    Optional<DocLock> findByDocumentId(Long documentId);
}

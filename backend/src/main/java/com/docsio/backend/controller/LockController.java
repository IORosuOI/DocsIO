package com.docsio.backend.controller;

import com.docsio.backend.domain.DocLock;
import com.docsio.backend.domain.Document;
import com.docsio.backend.service.DocumentService;
import com.docsio.backend.service.LockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/locks")
public class LockController {

    private final LockService lockService;
    private final DocumentService documentService;

    public LockController(LockService lockService, DocumentService documentService) {
        this.lockService = lockService;
        this.documentService = documentService;
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<?> getLockState(@PathVariable Long documentId) {
        try {
            return ResponseEntity.ok(lockService.getLockState(documentId));
        } catch (Exception e) {
            return ResponseEntity.ok(null);
        }
    }

    @PostMapping("/acquire/{documentId}")
    public ResponseEntity<?> acquire(@PathVariable Long documentId,
                                     @RequestHeader("X-User-Id") Long userId) {
        try {
            DocLock existing = lockService.getLockState(documentId);
            boolean expired = existing.getLastHeartbeat() == null ||
                    existing.getLastHeartbeat().isBefore(LocalDateTime.now().minusSeconds(30));

            if (existing.getLocked() && !expired && !existing.getLockedByUserId().equals(userId)) {
                return ResponseEntity.status(423).body("Document is locked by another user");
            }
            existing.setLocked(true);
            existing.setDateLocked(LocalDateTime.now());
            existing.setLastHeartbeat(LocalDateTime.now());
            existing.setLockedByUserId(userId);
            return ResponseEntity.ok(lockService.save(existing));

        } catch (Exception e) {
            Document doc = documentService.findById(documentId);
            DocLock lock = new DocLock();
            lock.setDocument(doc);
            lock.setLocked(true);
            lock.setDateLocked(LocalDateTime.now());
            lock.setLastHeartbeat(LocalDateTime.now());
            lock.setLockedByUserId(userId);
            return ResponseEntity.ok(lockService.save(lock));
        }
    }

    @PostMapping("/heartbeat/{documentId}")
    public ResponseEntity<?> heartbeat(@PathVariable Long documentId,
                                       @RequestHeader("X-User-Id") Long userId) {
        try {
            DocLock lock = lockService.getLockState(documentId);
            if (lock.getLocked() && lock.getLockedByUserId().equals(userId)) {
                lock.setLastHeartbeat(LocalDateTime.now());
                lockService.save(lock);
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/release/{documentId}")
    public ResponseEntity<?> release(@PathVariable Long documentId,
                                     @RequestHeader("X-User-Id") Long userId) {
        try {
            DocLock lock = lockService.getLockState(documentId);
            if (lock.getLockedByUserId().equals(userId)) {
                lock.setLocked(false);
                lock.setLockedByUserId(null);
                lockService.save(lock);
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
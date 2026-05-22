package com.docsio.backend.controller;

import com.docsio.backend.domain.DocLock;
import com.docsio.backend.service.LockService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/locks")
public class LockController {

    private final LockService lockService;

    public LockController(LockService lockService) {
        this.lockService = lockService;
    }

    @GetMapping("/document/{documentId}")
    public DocLock getLockState(@PathVariable Long documentId) {
        return lockService.getLockState(documentId);
    }

    @PostMapping
    public DocLock save(@RequestBody DocLock lock) {
        return lockService.save(lock);
    }
}

package com.docsio.backend.controller;

import com.docsio.backend.domain.Folder;
import com.docsio.backend.service.FolderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping
    public List<Folder> getAll() {
        return folderService.findAll();
    }

    @PostMapping
    public Folder create(@RequestBody Folder folder) {
        return folderService.save(folder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        folderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

package com.docsio.backend.service;

import com.docsio.backend.domain.Folder;

import java.util.List;

public interface FolderService {
    Folder save(Folder folder);
    List<Folder> findAll();
    void delete(Long id);
}
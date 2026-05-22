package com.docsio.backend.service;

import com.docsio.backend.domain.Folder;
import com.docsio.backend.repository.FolderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FolderServiceImpl implements FolderService {
    private final FolderRepository folderRepository;

    public FolderServiceImpl(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    @Override
    public Folder save(Folder folder) { return folderRepository.save(folder); }

    @Override
    public List<Folder> findAll() { return folderRepository.findAll(); }

    @Override
    public void delete(Long id) { folderRepository.deleteById(id); }
}
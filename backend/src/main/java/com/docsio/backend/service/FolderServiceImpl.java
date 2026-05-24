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

    @Override
    public List<Folder> findByOwner(Long ownerId) {
        return folderRepository.findByOwnerId(ownerId);
    }

    @Override
    public List<Folder> findByParent(Long parentId) {
        return folderRepository.findByParentId(parentId);
    }

    @Override
    public Folder update(Long id, Folder folder) {
        Folder existing = folderRepository.findById(id).orElseThrow();
        existing.setName(folder.getName());
        existing.setParentId(folder.getParentId());
        return folderRepository.save(existing);
    }

    @Override
    public Folder findById(Long id) {
        return folderRepository.findById(id).orElseThrow();
    }
}
package com.docsio.backend.repository;

import com.docsio.backend.domain.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByOwnerId(Long ownerId);
}
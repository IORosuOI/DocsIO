package com.docsio.backend.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class Document {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String color;
    private Boolean isPinned;
    private Boolean isDeleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_modified")
    private LocalDateTime lastModified;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "folder_id")
    private Folder folder;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public Boolean getPinned() { return isPinned; }
    public void setPinned(Boolean pinned) { isPinned = pinned; }
    public Boolean getDeleted() { return isDeleted; }
    public void setDeleted(Boolean deleted) { isDeleted = deleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getLastModified() { return lastModified; }
    public void setLastModified(LocalDateTime lastModified) { this.lastModified = lastModified; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public Folder getFolder() { return folder; }
    public void setFolder(Folder folder) { this.folder = folder; }
}
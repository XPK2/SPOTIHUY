package com.spotihuy.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tracks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Track {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String title;

    private String artist;

    private String thumbnailUrl;

    private Integer duration; // in seconds

    @Column(name = "platform")
    @Enumerated(EnumType.STRING)
    private Platform platform;

    @Column(name = "added_by")
    private String addedBy;

    @Column(name = "added_at")
    private LocalDateTime addedAt;

    @Column(name = "stream_url")
    private String streamUrl;

    @Column(name = "is_active")
    private Boolean isActive;

    public enum Platform {
        YOUTUBE, SOUNDCLOUD
    }

    @PrePersist
    public void prePersist() {
        if (addedAt == null) {
            addedAt = LocalDateTime.now();
        }
        if (isActive == null) {
            isActive = true;
        }
        if (platform == null) {
            platform = detectPlatform();
        }
    }

    private Platform detectPlatform() {
        if (url.contains("youtube.com") || url.contains("youtu.be")) {
            return Platform.YOUTUBE;
        } else if (url.contains("soundcloud.com")) {
            return Platform.SOUNDCLOUD;
        }
        return Platform.YOUTUBE; // default
    }
}
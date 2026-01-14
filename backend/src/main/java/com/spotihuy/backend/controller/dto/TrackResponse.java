package com.spotihuy.backend.controller.dto;

import com.spotihuy.backend.entity.Track;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TrackResponse {
    private Long id;
    private String url;
    private String title;
    private String artist;
    private String thumbnailUrl;
    private Integer duration;
    private Track.Platform platform;
    private String addedBy;
    private LocalDateTime addedAt;
    private String streamUrl;

    public static TrackResponse fromEntity(Track track) {
        return TrackResponse.builder()
                .id(track.getId())
                .url(track.getUrl())
                .title(track.getTitle())
                .artist(track.getArtist())
                .thumbnailUrl(track.getThumbnailUrl())
                .duration(track.getDuration())
                .platform(track.getPlatform())
                .addedBy(track.getAddedBy())
                .addedAt(track.getAddedAt())
                .streamUrl(track.getStreamUrl())
                .build();
    }
}
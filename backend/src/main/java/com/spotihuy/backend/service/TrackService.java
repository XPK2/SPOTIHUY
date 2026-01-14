package com.spotihuy.backend.service;

import com.spotihuy.backend.controller.dto.AddTrackRequest;
import com.spotihuy.backend.entity.Track;
import com.spotihuy.backend.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class TrackService {

    private final TrackRepository trackRepository;
    private final MediaService mediaService;

    /**
     * Add a new track from URL
     */
    @Transactional
    public Track addTrack(AddTrackRequest request) throws Exception {
        log.info("Adding track from URL: {}", request.getUrl());

        // Validate URL format
        if (!isValidUrl(request.getUrl())) {
            throw new IllegalArgumentException("Invalid URL format");
        }

        // Check if URL is accessible
        if (!mediaService.isValidMediaUrl(request.getUrl())) {
            throw new IllegalArgumentException("URL is not accessible");
        }

        // Extract track information
        Track track = mediaService.extractTrackInfo(request.getUrl(), request.getAddedBy());

        // Save to database
        Track savedTrack = trackRepository.save(track);
        log.info("Successfully added track: {} (ID: {})", savedTrack.getTitle(), savedTrack.getId());

        return savedTrack;
    }

    /**
     * Get all active tracks (queue)
     */
    public List<Track> getActiveTracks() {
        return trackRepository.findActiveTracks();
    }

    /**
     * Get track by ID
     */
    public Optional<Track> getTrackById(Long id) {
        return trackRepository.findById(id);
    }

    /**
     * Remove track (soft delete)
     */
    @Transactional
    public void removeTrack(Long id) {
        Optional<Track> trackOpt = trackRepository.findById(id);
        if (trackOpt.isPresent()) {
            Track track = trackOpt.get();
            track.setIsActive(false);
            trackRepository.save(track);
            log.info("Soft deleted track: {} (ID: {})", track.getTitle(), id);
        }
    }

    /**
     * Get tracks by user
     */
    public List<Track> getTracksByUser(String addedBy) {
        return trackRepository.findByAddedByAndIsActiveTrueOrderByAddedAtDesc(addedBy);
    }

    /**
     * Get stream URL for track
     */
    public String getStreamUrl(Long trackId) throws Exception {
        Optional<Track> trackOpt = trackRepository.findById(trackId);
        if (trackOpt.isPresent()) {
            Track track = trackOpt.get();
            // Get fresh stream URL
            return mediaService.getAudioStreamUrl(track.getUrl());
        }
        throw new IllegalArgumentException("Track not found");
    }

    private boolean isValidUrl(String url) {
        return url != null &&
               !url.trim().isEmpty() &&
               (url.contains("youtube.com") || url.contains("youtu.be") || url.contains("soundcloud.com"));
    }
}
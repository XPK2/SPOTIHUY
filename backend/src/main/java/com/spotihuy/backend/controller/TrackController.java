package com.spotihuy.backend.controller;

import com.spotihuy.backend.controller.dto.AddTrackRequest;
import com.spotihuy.backend.controller.dto.TrackResponse;
import com.spotihuy.backend.entity.Track;
import com.spotihuy.backend.service.TrackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TrackController {

    private final TrackService trackService;

    /**
     * Add a new track to the queue
     */
    @PostMapping
    public ResponseEntity<TrackResponse> addTrack(@Valid @RequestBody AddTrackRequest request) {
        try {
            log.info("Adding track from URL: {}", request.getUrl());
            Track track = trackService.addTrack(request);
            TrackResponse response = TrackResponse.fromEntity(track);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid track request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Failed to add track", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all active tracks (queue)
     */
    @GetMapping
    public ResponseEntity<List<TrackResponse>> getQueue() {
        try {
            List<Track> tracks = trackService.getActiveTracks();
            List<TrackResponse> responses = tracks.stream()
                    .map(TrackResponse::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Failed to get queue", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get track by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TrackResponse> getTrack(@PathVariable Long id) {
        try {
            return trackService.getTrackById(id)
                    .map(track -> ResponseEntity.ok(TrackResponse.fromEntity(track)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Failed to get track with ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get stream URL for track
     */
    @GetMapping("/{id}/stream")
    public ResponseEntity<String> getStreamUrl(@PathVariable Long id) {
        try {
            String streamUrl = trackService.getStreamUrl(id);
            return ResponseEntity.ok(streamUrl);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Failed to get stream URL for track ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Remove track from queue
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeTrack(@PathVariable Long id) {
        try {
            trackService.removeTrack(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Failed to remove track with ID: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get tracks added by a specific user
     */
    @GetMapping("/user/{addedBy}")
    public ResponseEntity<List<TrackResponse>> getTracksByUser(@PathVariable String addedBy) {
        try {
            List<Track> tracks = trackService.getTracksByUser(addedBy);
            List<TrackResponse> responses = tracks.stream()
                    .map(TrackResponse::fromEntity)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Failed to get tracks for user: {}", addedBy, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
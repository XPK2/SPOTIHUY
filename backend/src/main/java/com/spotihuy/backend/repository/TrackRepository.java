package com.spotihuy.backend.repository;

import com.spotihuy.backend.entity.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrackRepository extends JpaRepository<Track, Long> {

    List<Track> findByIsActiveTrueOrderByAddedAtAsc();

    @Query("SELECT t FROM Track t WHERE t.isActive = true ORDER BY t.addedAt DESC")
    List<Track> findActiveTracks();

    List<Track> findByAddedByAndIsActiveTrueOrderByAddedAtDesc(String addedBy);

    @Query("SELECT COUNT(t) FROM Track t WHERE t.addedAt >= :since")
    long countTracksAddedSince(LocalDateTime since);

    @Query("SELECT t FROM Track t WHERE t.platform = :platform AND t.isActive = true ORDER BY t.addedAt DESC")
    List<Track> findByPlatform(Track.Platform platform);
}
package com.spotihuy.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spotihuy.backend.entity.Track;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class MediaService {

    private final ObjectMapper objectMapper;

    @Value("${media.proxy.user-agent}")
    private String userAgent;

    @Value("${media.proxy.timeout:30000}")
    private int timeout;

    /**
     * Extract track information from YouTube/SoundCloud URL
     */
    @Cacheable(value = "trackInfo", key = "#url")
    public Track extractTrackInfo(String url, String addedBy) throws Exception {
        log.info("Extracting track info for URL: {}", url);

        Track.Platform platform = detectPlatform(url);

        // For now, create fallback track to test the API flow
        // TODO: Implement proper yt-dlp integration
        return createFallbackTrack(url, addedBy, platform);
    }

    /**
     * Generate streaming URL for the track
     */
    public String generateStreamUrl(String originalUrl) {
        // For now, return the original URL
        // In production, this would be a proxied URL that serves the extracted audio
        return originalUrl;
    }

    /**
     * Get direct audio stream URL
     */
    public String getAudioStreamUrl(String url) throws Exception {
        log.info("Getting audio stream URL for: {}", url);

        // For now, return the original URL as stream URL
        // TODO: Implement proper audio stream extraction
        return url;
    }

    /**
     * Check if URL is accessible and valid
     */
    public boolean isValidMediaUrl(String url) {
        try {
            URL urlObj = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) urlObj.openConnection();
            connection.setRequestMethod("HEAD");
            connection.setRequestProperty("User-Agent", userAgent);
            connection.setConnectTimeout(timeout);
            connection.setReadTimeout(timeout);

            int responseCode = connection.getResponseCode();
            return responseCode >= 200 && responseCode < 400;
        } catch (Exception e) {
            log.warn("URL validation failed for: {}", url, e);
            return false;
        }
    }

    private Track.Platform detectPlatform(String url) {
        if (url.contains("youtube.com") || url.contains("youtu.be")) {
            return Track.Platform.YOUTUBE;
        } else if (url.contains("soundcloud.com")) {
            return Track.Platform.SOUNDCLOUD;
        }
        return Track.Platform.YOUTUBE;
    }

    private Integer parseDuration(String durationStr) {
        try {
            if (durationStr == null || durationStr.isEmpty()) return null;
            return Integer.parseInt(durationStr);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Track createFallbackTrack(String url, String addedBy, Track.Platform platform) {
        String title = extractTitleFromUrl(url);
        String artist = "Unknown Artist";

        // Try to extract more info from URL
        if (platform == Track.Platform.YOUTUBE) {
            if (url.contains("youtube.com/watch?v=")) {
                title = "YouTube Video";
                artist = "YouTube";
            } else if (url.contains("youtu.be/")) {
                title = "YouTube Short";
                artist = "YouTube";
            }
        } else if (platform == Track.Platform.SOUNDCLOUD) {
            artist = "SoundCloud";
            title = "SoundCloud Track";
        }

        return Track.builder()
                .url(url)
                .title(title)
                .artist(artist)
                .platform(platform)
                .addedBy(addedBy != null ? addedBy : "Anonymous")
                .streamUrl(url)
                .duration(180) // 3 minutes default
                .build();
    }

    private String extractTitleFromUrl(String url) {
        try {
            // Basic URL parsing to extract title-like information
            if (url.contains("youtube.com/watch?v=")) {
                return "YouTube Video";
            } else if (url.contains("soundcloud.com/")) {
                String[] parts = url.split("/");
                if (parts.length >= 5) {
                    return parts[parts.length - 1].replace("-", " ");
                }
            }
        } catch (Exception e) {
            log.warn("Failed to extract title from URL: {}", url);
        }
        return "Unknown Track";
    }
}
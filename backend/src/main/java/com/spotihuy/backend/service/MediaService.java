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

        try {
            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.command("yt-dlp",
                    "--no-playlist",
                    "--print-json",
                    "--no-warnings",
                    "--extract-audio",
                    "--audio-format", "mp3",
                    "--audio-quality", "128K",
                    url);

            Process process = processBuilder.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                StringBuilder output = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line);
                }

                boolean finished = process.waitFor(30, TimeUnit.SECONDS);
                if (!finished) {
                    process.destroyForcibly();
                    throw new RuntimeException("yt-dlp extraction timed out");
                }

                if (process.exitValue() != 0) {
                    throw new RuntimeException("yt-dlp extraction failed");
                }

                String jsonOutput = output.toString();
                JsonNode jsonNode = objectMapper.readTree(jsonOutput);

                return Track.builder()
                        .url(url)
                        .title(jsonNode.path("title").asText("Unknown Title"))
                        .artist(jsonNode.path("uploader").asText("Unknown Artist"))
                        .thumbnailUrl(jsonNode.path("thumbnail").asText())
                        .duration(parseDuration(jsonNode.path("duration").asText()))
                        .platform(platform)
                        .addedBy(addedBy != null ? addedBy : "Anonymous")
                        .streamUrl(generateStreamUrl(url))
                        .build();

            }
        } catch (IOException e) {
            log.error("Failed to extract track info for URL: {}", url, e);
            // Fallback: create basic track info
            return createFallbackTrack(url, addedBy, platform);
        }
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
     * Get direct audio stream URL using yt-dlp
     */
    public String getAudioStreamUrl(String url) throws Exception {
        log.info("Getting audio stream URL for: {}", url);

        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command("yt-dlp",
                "--no-playlist",
                "--get-url",
                "--extract-audio",
                "--audio-format", "mp3",
                "--audio-quality", "128K",
                url);

        Process process = processBuilder.start();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String streamUrl = reader.readLine();

            boolean finished = process.waitFor(15, TimeUnit.SECONDS);
            if (!finished || process.exitValue() != 0) {
                process.destroyForcibly();
                throw new RuntimeException("Failed to get stream URL");
            }

            return streamUrl != null ? streamUrl.trim() : null;
        }
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

        return Track.builder()
                .url(url)
                .title(title)
                .artist("Unknown Artist")
                .platform(platform)
                .addedBy(addedBy != null ? addedBy : "Anonymous")
                .streamUrl(url)
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
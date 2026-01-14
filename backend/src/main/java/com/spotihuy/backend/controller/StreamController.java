package com.spotihuy.backend.controller;

import com.spotihuy.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
@RequestMapping("/api/stream")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class StreamController {

    private final MediaService mediaService;

    /**
     * Proxy audio stream to bypass CORS
     */
    @GetMapping("/{trackId}")
    public ResponseEntity<StreamingResponseBody> streamAudio(@PathVariable Long trackId) {
        try {
            log.info("Streaming audio for track ID: {}", trackId);

            // For now, we'll proxy the original URL
            // In production, this should use the actual stream URL from yt-dlp
            String streamUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Placeholder

            URL url = new URL(streamUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            if (connection.getResponseCode() != 200) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
            }

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "audio/mpeg");
            headers.set("Accept-Ranges", "bytes");
            headers.set("Cache-Control", "no-cache");

            StreamingResponseBody stream = outputStream -> {
                try (InputStream inputStream = connection.getInputStream()) {
                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, bytesRead);
                    }
                } catch (IOException e) {
                    log.error("Error streaming audio", e);
                }
            };

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(stream);

        } catch (Exception e) {
            log.error("Failed to stream audio for track ID: {}", trackId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
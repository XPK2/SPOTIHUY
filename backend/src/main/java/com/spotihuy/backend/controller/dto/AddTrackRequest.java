package com.spotihuy.backend.controller.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddTrackRequest {
    @NotBlank(message = "URL is required")
    private String url;

    private String addedBy;
}
package com.meatup.media.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaUploadResponse {
    private boolean success;
    private String message;
    private Long mediaId;
    private String url;
    private String fileName;
    private Long fileSize;
}


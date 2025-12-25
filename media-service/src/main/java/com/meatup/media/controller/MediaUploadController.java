package com.meatup.media.controller;

import com.meatup.media.dto.MediaUploadResponse;
import com.meatup.media.service.MediaUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/media/upload")
@RequiredArgsConstructor
@Slf4j
public class MediaUploadController {

    private final MediaUploadService mediaUploadService;

    @PostMapping("/video")
    public ResponseEntity<MediaUploadResponse> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "orderId", required = false) Long orderId,
            @RequestParam(value = "butcherId", required = false) Long butcherId,
            @RequestParam(value = "description", required = false) String description) {
        
        try {
            log.info("Uploading video file: {}, size: {} bytes", file.getOriginalFilename(), file.getSize());
            
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(MediaUploadResponse.builder()
                        .success(false)
                        .message("File is empty")
                        .build());
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("video/")) {
                return ResponseEntity.badRequest()
                    .body(MediaUploadResponse.builder()
                        .success(false)
                        .message("File must be a video")
                        .build());
            }

            // Validate file size (max 500MB)
            long maxSize = 500 * 1024 * 1024; // 500MB
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest()
                    .body(MediaUploadResponse.builder()
                        .success(false)
                        .message("File size exceeds 500MB limit")
                        .build());
            }

            MediaUploadResponse response = mediaUploadService.uploadVideo(file, orderId, butcherId, description);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            log.error("Error uploading video", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(MediaUploadResponse.builder()
                    .success(false)
                    .message("Failed to upload video: " + e.getMessage())
                    .build());
        }
    }

    @PostMapping("/image")
    public ResponseEntity<MediaUploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "orderId", required = false) Long orderId,
            @RequestParam(value = "butcherId", required = false) Long butcherId,
            @RequestParam(value = "description", required = false) String description) {
        
        try {
            log.info("Uploading image file: {}, size: {} bytes", file.getOriginalFilename(), file.getSize());
            
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(MediaUploadResponse.builder()
                        .success(false)
                        .message("File is empty")
                        .build());
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                    .body(MediaUploadResponse.builder()
                        .success(false)
                        .message("File must be an image")
                        .build());
            }

            // Max 10MB for images
            long maxSize = 10 * 1024 * 1024; // 10MB
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest()
                    .body(MediaUploadResponse.builder()
                        .success(false)
                        .message("File size exceeds 10MB limit")
                        .build());
            }

            MediaUploadResponse response = mediaUploadService.uploadImage(file, orderId, butcherId, description);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            log.error("Error uploading image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(MediaUploadResponse.builder()
                    .success(false)
                    .message("Failed to upload image: " + e.getMessage())
                    .build());
        }
    }
}


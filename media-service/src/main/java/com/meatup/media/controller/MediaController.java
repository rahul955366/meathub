package com.meatup.media.controller;

import com.meatup.media.dto.MediaResponse;
import com.meatup.media.dto.MediaUploadRequest;
import com.meatup.media.entity.Media;
import com.meatup.media.service.MediaService;
import com.meatup.media.service.StorageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @Autowired
    private StorageService storageService;

    /**
     * Upload media file (multipart/form-data)
     * Supports both image and video uploads
     */
    @PostMapping(value = "/upload/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaResponse> uploadMediaFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("relatedType") Media.RelatedType relatedType,
            @RequestParam("relatedId") Long relatedId,
            @RequestParam("mediaType") Media.MediaType mediaType,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "dishName", required = false) String dishName) {
        
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            if (!storageService.isValidFileType(file.getContentType())) {
                return ResponseEntity.badRequest().build();
            }

            if (file.getSize() > storageService.getMaxFileSize()) {
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
            }

            // Determine folder based on media type
            String folder = mediaType == Media.MediaType.VIDEO ? "videos" : "images";
            
            // Upload file to storage
            String mediaUrl = storageService.uploadFile(file, folder);

            // Create media record
            MediaUploadRequest request = new MediaUploadRequest();
            request.setRelatedType(relatedType);
            request.setRelatedId(relatedId);
            request.setMediaType(mediaType);
            request.setMediaUrl(mediaUrl);
            request.setDescription(description);
            request.setDishName(dishName);

            MediaResponse response = mediaService.uploadMedia(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Upload media URL (existing endpoint for URL-based uploads)
     */
    @PostMapping("/upload")
    public ResponseEntity<MediaResponse> uploadMedia(@Valid @RequestBody MediaUploadRequest request) {
        MediaResponse response = mediaService.uploadMedia(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<MediaResponse>> getOrderMedia(@PathVariable Long orderId) {
        return ResponseEntity.ok(mediaService.getMediaByRelated(Media.RelatedType.ORDER, orderId));
    }

    @GetMapping("/meat-item/{meatItemId}")
    public ResponseEntity<List<MediaResponse>> getMeatItemMedia(@PathVariable Long meatItemId) {
        return ResponseEntity.ok(mediaService.getMediaByRelated(Media.RelatedType.MEAT_ITEM, meatItemId));
    }

    @GetMapping("/cooking/{dishName}")
    public ResponseEntity<List<MediaResponse>> getCookingMedia(@PathVariable String dishName) {
        return ResponseEntity.ok(mediaService.getCookingMedia(dishName));
    }
}

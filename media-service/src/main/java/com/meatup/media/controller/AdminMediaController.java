package com.meatup.media.controller;

import com.meatup.media.dto.MediaResponse;
import com.meatup.media.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/media")
public class AdminMediaController {

    @Autowired
    private MediaService mediaService;

    @GetMapping
    public ResponseEntity<List<MediaResponse>> getAllMedia() {
        return ResponseEntity.ok(mediaService.getAllMedia());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long id) {
        mediaService.deleteMedia(id);
        return ResponseEntity.noContent().build();
    }
}

package com.meatup.media.service;

import com.meatup.media.dto.MediaResponse;
import com.meatup.media.dto.MediaUploadRequest;
import com.meatup.media.entity.Media;
import com.meatup.media.exception.MediaNotFoundException;
import com.meatup.media.repository.MediaRepository;
import com.meatup.media.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    @Transactional
    public MediaResponse uploadMedia(MediaUploadRequest request) {
        Long userId = getCurrentUserId();
        boolean isAdmin = hasRole("ROLE_ADMIN");
        boolean isButcher = hasRole("ROLE_BUTCHER");

        Media media = new Media();
        media.setRelatedType(request.getRelatedType());
        media.setRelatedId(request.getRelatedId());
        media.setMediaType(request.getMediaType());
        media.setMediaUrl(request.getMediaUrl());
        media.setDescription(request.getDescription());
        media.setDishName(request.getDishName());
        media.setUploaderId(userId);

        if (isAdmin) {
            media.setUploadedBy(Media.UploaderRole.ADMIN);
        } else if (isButcher) {
            media.setUploadedBy(Media.UploaderRole.BUTCHER);
        } else {
            // Should be caught by security config, but safe guard
            throw new RuntimeException("Unauthorized uploader role");
        }

        Media savedMedia = mediaRepository.save(media);
        return mapToResponse(savedMedia);
    }

    public List<MediaResponse> getMediaByRelated(Media.RelatedType type, Long id) {
        // Ideally we check if user owns the Order here.
        // For MVP, simplistic check or trust frontend/user context
        return mediaRepository.findByRelatedTypeAndRelatedId(type, id).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MediaResponse> getCookingMedia(String dishName) {
        return mediaRepository.findByRelatedTypeAndDishNameContainingIgnoreCase(Media.RelatedType.COOKING, dishName)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MediaResponse> getAllMedia() {
        return mediaRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteMedia(Long id) {
        if (!mediaRepository.existsById(id)) {
            throw new MediaNotFoundException("Media not found with id: " + id);
        }
        mediaRepository.deleteById(id);
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        return userPrincipal.getUserId();
    }

    private boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        return authorities.stream().anyMatch(a -> a.getAuthority().equals(role));
    }

    private MediaResponse mapToResponse(Media media) {
        MediaResponse response = new MediaResponse();
        response.setId(media.getId());
        response.setRelatedType(media.getRelatedType());
        response.setRelatedId(media.getRelatedId());
        response.setUploadedBy(media.getUploadedBy());
        response.setUploaderId(media.getUploaderId());
        response.setMediaType(media.getMediaType());
        response.setMediaUrl(media.getMediaUrl());
        response.setDescription(media.getDescription());
        response.setDishName(media.getDishName());
        response.setCreatedAt(media.getCreatedAt());
        return response;
    }
}

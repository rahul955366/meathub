package com.meatup.media.dto;

import com.meatup.media.entity.Media;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaResponse {
    private Long id;
    private Media.RelatedType relatedType;
    private Long relatedId;
    private Media.UploaderRole uploadedBy;
    private Long uploaderId;
    private Media.MediaType mediaType;
    private String mediaUrl;
    private String description;
    private String dishName;
    private LocalDateTime createdAt;
}

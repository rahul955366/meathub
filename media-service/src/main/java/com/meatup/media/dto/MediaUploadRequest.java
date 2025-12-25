package com.meatup.media.dto;

import com.meatup.media.entity.Media;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaUploadRequest {

    @NotNull(message = "Related type is required")
    private Media.RelatedType relatedType;

    @NotNull(message = "Related ID is required (Order ID, Item ID, or 0 for General)")
    private Long relatedId;

    @NotNull(message = "Media type is required")
    private Media.MediaType mediaType;

    @NotBlank(message = "Media URL is required")
    @URL(message = "Invalid URL format")
    @Size(max = 500, message = "URL must not exceed 500 characters")
    private String mediaUrl;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    @Size(max = 100, message = "Dish name must not exceed 100 characters")
    private String dishName;
}

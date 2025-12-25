package com.meatup.media.repository;

import com.meatup.media.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByRelatedTypeAndRelatedId(Media.RelatedType relatedType, Long relatedId);

    List<Media> findByRelatedTypeAndDishNameContainingIgnoreCase(Media.RelatedType relatedType, String dishName);

    List<Media> findByUploadedBy(Media.UploaderRole uploadedBy);
}

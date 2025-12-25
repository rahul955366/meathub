package com.meatup.media.service;

import com.meatup.media.dto.MediaUploadResponse;
import com.meatup.media.entity.Media;
import com.meatup.media.entity.MediaType;
import com.meatup.media.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaUploadService {

    private final MediaRepository mediaRepository;

    @Value("${media.upload.directory:./uploads}")
    private String uploadDirectory;

    @Value("${media.base.url:http://localhost:8089/media}")
    private String baseUrl;

    public MediaUploadResponse uploadVideo(MultipartFile file, Long orderId, Long butcherId, String description) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDirectory, "videos");
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".mp4";
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Save metadata to database
            Media media = new Media();
            media.setType(MediaType.VIDEO);
            media.setFileName(filename);
            media.setOriginalFileName(originalFilename);
            media.setFilePath(filePath.toString());
            media.setUrl(baseUrl + "/videos/" + filename);
            media.setFileSize(file.getSize());
            media.setContentType(file.getContentType());
            media.setOrderId(orderId);
            media.setButcherId(butcherId);
            media.setDescription(description);

            Media savedMedia = mediaRepository.save(media);

            log.info("Video uploaded successfully: {}", savedMedia.getId());

            return MediaUploadResponse.builder()
                .success(true)
                .message("Video uploaded successfully")
                .mediaId(savedMedia.getId())
                .url(savedMedia.getUrl())
                .fileName(savedMedia.getFileName())
                .fileSize(savedMedia.getFileSize())
                .build();

        } catch (IOException e) {
            log.error("Error saving video file", e);
            return MediaUploadResponse.builder()
                .success(false)
                .message("Failed to save video file: " + e.getMessage())
                .build();
        } catch (Exception e) {
            log.error("Error uploading video", e);
            return MediaUploadResponse.builder()
                .success(false)
                .message("Failed to upload video: " + e.getMessage())
                .build();
        }
    }

    public MediaUploadResponse uploadImage(MultipartFile file, Long orderId, Long butcherId, String description) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDirectory, "images");
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Save metadata to database
            Media media = new Media();
            media.setType(MediaType.IMAGE);
            media.setFileName(filename);
            media.setOriginalFileName(originalFilename);
            media.setFilePath(filePath.toString());
            media.setUrl(baseUrl + "/images/" + filename);
            media.setFileSize(file.getSize());
            media.setContentType(file.getContentType());
            media.setOrderId(orderId);
            media.setButcherId(butcherId);
            media.setDescription(description);

            Media savedMedia = mediaRepository.save(media);

            log.info("Image uploaded successfully: {}", savedMedia.getId());

            return MediaUploadResponse.builder()
                .success(true)
                .message("Image uploaded successfully")
                .mediaId(savedMedia.getId())
                .url(savedMedia.getUrl())
                .fileName(savedMedia.getFileName())
                .fileSize(savedMedia.getFileSize())
                .build();

        } catch (IOException e) {
            log.error("Error saving image file", e);
            return MediaUploadResponse.builder()
                .success(false)
                .message("Failed to save image file: " + e.getMessage())
                .build();
        } catch (Exception e) {
            log.error("Error uploading image", e);
            return MediaUploadResponse.builder()
                .success(false)
                .message("Failed to upload image: " + e.getMessage())
                .build();
        }
    }
}


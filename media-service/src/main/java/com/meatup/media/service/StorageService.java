// MEATHUB - Storage Service (S3/CloudFront Integration)

package com.meatup.media.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class StorageService {

    @Value("${storage.type:local}") // local, s3, cloudfront
    private String storageType;

    @Value("${storage.local.path:./uploads}")
    private String localStoragePath;

    @Value("${storage.s3.bucket:meathub-media}")
    private String s3Bucket;

    @Value("${storage.s3.region:us-east-1}")
    private String s3Region;

    @Value("${storage.cloudfront.url:}")
    private String cloudfrontUrl;

    /**
     * Upload file to storage (S3 or local)
     * Returns public URL for the uploaded file
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String fileName = generateFileName(file.getOriginalFilename());
        String filePath = folder != null ? folder + "/" + fileName : fileName;

        switch (storageType.toLowerCase()) {
            case "s3":
                return uploadToS3(file, filePath);
            case "cloudfront":
                return uploadToCloudFront(file, filePath);
            case "local":
            default:
                return uploadToLocal(file, filePath);
        }
    }

    /**
     * Upload to local filesystem (for development)
     */
    private String uploadToLocal(MultipartFile file, String filePath) throws IOException {
        Path uploadPath = Paths.get(localStoragePath);
        
        // Create directory if it doesn't exist
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path targetPath = uploadPath.resolve(filePath);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Return relative URL (in production, this would be absolute URL)
        return "/uploads/" + filePath;
    }

    /**
     * Upload to AWS S3
     * TODO: Implement actual S3 upload using AWS SDK
     */
    private String uploadToS3(MultipartFile file, String filePath) throws IOException {
        // Placeholder for S3 upload
        // In production, use AWS SDK:
        // AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
        //     .withRegion(s3Region)
        //     .build();
        // PutObjectRequest putRequest = new PutObjectRequest(s3Bucket, filePath, file.getInputStream(), metadata);
        // s3Client.putObject(putRequest);
        
        log.warn("S3 upload not implemented, falling back to local storage");
        return uploadToLocal(file, filePath);
    }

    /**
     * Upload to CloudFront (via S3)
     * TODO: Implement actual CloudFront integration
     */
    private String uploadToCloudFront(MultipartFile file, String filePath) throws IOException {
        // Upload to S3 first, then return CloudFront URL
        String s3Url = uploadToS3(file, filePath);
        
        if (cloudfrontUrl != null && !cloudfrontUrl.isEmpty()) {
            return cloudfrontUrl + "/" + filePath;
        }
        
        return s3Url;
    }

    /**
     * Delete file from storage
     */
    public void deleteFile(String fileUrl) throws IOException {
        switch (storageType.toLowerCase()) {
            case "s3":
                deleteFromS3(fileUrl);
                break;
            case "cloudfront":
                deleteFromCloudFront(fileUrl);
                break;
            case "local":
            default:
                deleteFromLocal(fileUrl);
                break;
        }
    }

    private void deleteFromLocal(String fileUrl) throws IOException {
        String relativePath = fileUrl.replace("/uploads/", "");
        Path filePath = Paths.get(localStoragePath, relativePath);
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
    }

    private void deleteFromS3(String fileUrl) {
        // TODO: Implement S3 delete
        log.warn("S3 delete not implemented");
    }

    private void deleteFromCloudFront(String fileUrl) {
        // CloudFront files are deleted from S3
        deleteFromS3(fileUrl);
    }

    /**
     * Generate unique filename
     */
    private String generateFileName(String originalFilename) {
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + extension;
    }

    /**
     * Get file size limit
     */
    public long getMaxFileSize() {
        // 100MB for videos, 10MB for images
        return 100 * 1024 * 1024; // 100MB
    }

    /**
     * Validate file type
     */
    public boolean isValidFileType(String contentType) {
        if (contentType == null) return false;
        
        return contentType.startsWith("image/") || 
               contentType.startsWith("video/") ||
               contentType.equals("application/octet-stream"); // Allow binary files
    }
}


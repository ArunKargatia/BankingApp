package com.ak.BankingApp.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final String uploadFolder;

    public CloudinaryService(
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret,
            @Value("${cloudinary.upload_folder}") String uploadFolder) {

        if (cloudName == null || apiKey == null || apiSecret == null || uploadFolder == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Missing Cloudinary credentials in application.properties");
        }

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));

        this.uploadFolder = uploadFolder;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }
        if (!file.getContentType().startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image files are allowed");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", uploadFolder));
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Image upload failed: " + e.getMessage());
        }
    }

    public void deleteImage(String imageUrl) throws IOException {
        if (imageUrl == null || !imageUrl.contains("/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image URL");
        }

        try {
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf("."));
            String publicId = uploadFolder + "/" + filename;
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Image deletion failed: " + e.getMessage());
        }
    }
}

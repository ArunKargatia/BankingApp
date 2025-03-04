package com.ak.BankingApp.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
            throw new IllegalArgumentException("Missing Cloudinary credentials in application.properties");
        }

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));

        this.uploadFolder = uploadFolder;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", uploadFolder));
        return uploadResult.get("url").toString();
    }

    public void deleteImage(String imageUrl) throws IOException {
        String filename = imageUrl.substring(imageUrl.lastIndexOf("/")+1, imageUrl.lastIndexOf("."));
        String publicId = uploadFolder + "/" + filename;
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}

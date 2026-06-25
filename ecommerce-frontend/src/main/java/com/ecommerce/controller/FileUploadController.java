package com.ecommerce.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    // Define the directory where files will be saved
    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public String uploadImage(@RequestParam("file") MultipartFile file) throws IOException {

        // Check if file is empty
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }

        // Create a unique file name to prevent overwriting
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        // Ensure the directory exists
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Save the file to the server
        File serverFile = new File(UPLOAD_DIR + fileName);
        file.transferTo(serverFile);

        // Return the accessible URL
        return "https://luxeloop-backend.onrender.com/uploads/" + fileName;
    }
}
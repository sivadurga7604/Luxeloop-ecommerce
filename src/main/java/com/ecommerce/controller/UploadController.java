package com.ecommerce.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@RestController
public class UploadController {

    private static final String CLOUD_NAME = "dfchvym13";
    private static final String API_KEY = "231363547154633";
    private static final String API_SECRET = "dyG-Yu7lytbTUuCOEvoY24YwR2U";

    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            long timestamp = System.currentTimeMillis() / 1000;

            // Generate SHA1 signature
            String toSign = "timestamp=" + timestamp + API_SECRET;
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] hash = md.digest(toSign.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            String signature = sb.toString();

            // Build multipart request to Cloudinary
            String boundary = "----Boundary" + System.currentTimeMillis();
            String uploadUrl = "https://api.cloudinary.com/v1_1/" + CLOUD_NAME + "/image/upload";

            URL url = new URL(uploadUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

            OutputStream os = conn.getOutputStream();

            // File field
            os.write(("--" + boundary + "\r\nContent-Disposition: form-data; name=\"file\"; filename=\""
                    + file.getOriginalFilename() + "\"\r\nContent-Type: " + file.getContentType() + "\r\n\r\n").getBytes(StandardCharsets.UTF_8));
            os.write(file.getBytes());
            os.write("\r\n".getBytes(StandardCharsets.UTF_8));

            // api_key field
            os.write(("--" + boundary + "\r\nContent-Disposition: form-data; name=\"api_key\"\r\n\r\n" + API_KEY + "\r\n").getBytes(StandardCharsets.UTF_8));

            // timestamp field
            os.write(("--" + boundary + "\r\nContent-Disposition: form-data; name=\"timestamp\"\r\n\r\n" + timestamp + "\r\n").getBytes(StandardCharsets.UTF_8));

            // signature field
            os.write(("--" + boundary + "\r\nContent-Disposition: form-data; name=\"signature\"\r\n\r\n" + signature + "\r\n").getBytes(StandardCharsets.UTF_8));

            // end boundary
            os.write(("--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();

            // Read response
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) response.append(line);
            br.close();

            // Extract secure_url from JSON response
            String res = response.toString();
            int start = res.indexOf("\"secure_url\":\"") + 14;
            int end = res.indexOf("\"", start);
            String cloudinaryUrl = res.substring(start, end);

            return cloudinaryUrl;

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR: " + e.getMessage();
        }
    }
}
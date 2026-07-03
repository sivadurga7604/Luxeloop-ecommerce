export const API = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8084"
    : "https://luxeloop-backend.onrender.com";

export const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://placehold.co/150x150?text=No+Image";
    // If it's a relative path like /uploads/..., prepend the API URL
    if (imageUrl.startsWith("/")) return `${API}${imageUrl}`;
    return imageUrl;
};

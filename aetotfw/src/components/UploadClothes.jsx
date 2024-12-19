import React, { useState } from "react";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { uploadPhoto, saveClothingItem } from "../service/upload"; // Import upload functions
import { getCurrentUserId } from "../service/auth";

const garmentTypes = ["Shirt", "Pants", "Dress", "Jacket", "Skirt", "Shoes"];
const seasons = ["Spring", "Summer", "Autumn", "Winter"];

const UploadClothes = () => {
  const [name, setName] = useState("");
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [garmentType, setGarmentType] = useState("");
  const [season, setSeason] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate unique paths for photos
      const frontPhotoPath = `front-${Date.now()}.jpg`;
      const backPhotoPath = `back-${Date.now()}.jpg`;

      // Upload photos to Supabase Storage
      const frontPhotoUrl = await uploadPhoto(frontPhoto, frontPhotoPath);
      const backPhotoUrl = await uploadPhoto(backPhoto, backPhotoPath);

      const userId = await getCurrentUserId();

      // Save clothing item to Supabase
      const itemDetails = {
        owner: userId, // Replace with actual user ID from authentication
        name,
        front_photo: frontPhotoPath,
        back_photo: backPhotoPath,
        garment_type: garmentType,
        season,
        keywords,
      };

      const data = await saveClothingItem(itemDetails);
      console.log("Clothing item saved:", data);

      // Reset form after successful upload
      setName("");
      setFrontPhoto(null);
      setBackPhoto(null);
      setGarmentType("");
      setSeason("");
      setKeywords("");
    } catch (error) {
      console.error("Error during upload:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "500px",
        margin: "auto",
        marginTop: "50px",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "#FF69B4",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Upload New Clothing
      </Typography>
      <form onSubmit={handleUpload}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          select
          label="Garment Type"
          variant="outlined"
          fullWidth
          required
          value={garmentType}
          onChange={(e) => setGarmentType(e.target.value)}
        >
          {garmentTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Season"
          variant="outlined"
          fullWidth
          required
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        >
          {seasons.map((season) => (
            <MenuItem key={season} value={season}>
              {season}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Keywords (comma-separated)"
          variant="outlined"
          fullWidth
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{
            backgroundColor: "#FF69B4",
            color: "#fff",
            "&:hover": { backgroundColor: "#FF1493" },
          }}
        >
          Upload Front Photo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setFrontPhoto(e.target.files[0])}
          />
        </Button>
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{
            backgroundColor: "#FF69B4",
            color: "#fff",
            "&:hover": { backgroundColor: "#FF1493" },
          }}
        >
          Upload Back Photo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setBackPhoto(e.target.files[0])}
          />
        </Button>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#FF69B4",
            color: "#fff",
            padding: "10px 0",
            "&:hover": { backgroundColor: "#FF1493" },
          }}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </form>
    </Box>
  );
};

export default UploadClothes;

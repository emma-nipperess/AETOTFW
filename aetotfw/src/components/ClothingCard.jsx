import React, { useState, useEffect } from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { getItemImage } from "../service/clothes"; // Import the function to get the image URL

const ClothingCard = ({ name, frontPhotoName }) => {
    
  console.log("card: ", name, frontPhotoName)
  const [frontPhotoUrl, setFrontPhotoUrl] = useState(null);
  useEffect(() => {
    const loadPhotoUrl = async () => {
      if (frontPhotoName) {
        const photoUrl = getItemImage(frontPhotoName); // Get the public URL
        setFrontPhotoUrl(photoUrl);
        console.log(photoUrl, "jou")
      }
    };

    loadPhotoUrl();
  }, [frontPhotoName]);

  return (
    <Card
      sx={{
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
      }}
    >
      {/* Front photo */}
      {frontPhotoUrl && (
        <CardMedia
          component="img"
          height="200"
          image={frontPhotoUrl}
          alt={name}
          sx={{ objectFit: "cover" }}
        />
      )}
      {/* Name */}
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#FF69B4",
            fontWeight: "bold",
          }}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ClothingCard;

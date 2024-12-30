import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Button } from "@mui/material";
import { fetchClothes, getItemImage } from "../service/clothes"; // Fetch all clothing items

const ExplorePage = () => {
  const [randomOutfits, setRandomOutfits] = useState([]);

  const generateRandomOutfits = async (clothes) => {
    const tops = clothes.filter((item) => item.garment_type === "Shirt");
    const bottoms = clothes.filter((item) => item.garment_type === "Pants");
    const shoes = clothes.filter((item) => item.garment_type === "Shoes");

    // Generate random outfits
    const outfits = Array.from({ length: 5 }, () => ({
      top: tops[Math.floor(Math.random() * tops.length)],
      bottom: bottoms[Math.floor(Math.random() * bottoms.length)],
      shoe: shoes[Math.floor(Math.random() * shoes.length)],
    }));

    return outfits;
  };

  useEffect(() => {
    const loadClothesAndGenerateOutfits = async () => {
      try {
        const data = await fetchClothes(); // Fetch all clothing items
        const clothesWithImages = await Promise.all(
          data.map(async (item) => ({
            ...item,
            image: await getItemImage(item.front_photo), // Fetch image URLs
          }))
        );

        const outfits = await generateRandomOutfits(clothesWithImages);
        setRandomOutfits(outfits);
      } catch (error) {
        console.error("Error loading clothes or generating outfits:", error.message);
      }
    };

    loadClothesAndGenerateOutfits();
  }, []);

  const renderOutfitCard = (outfit, index) => {
    const { top, bottom, shoe } = outfit;

    return (
      <Card
        key={index}
        sx={{
          width: "300px",
          margin: "16px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
            Random Outfit #{index + 1}
          </Typography>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            padding: "16px",
          }}
        >
          {top && (
            <CardMedia
              component="img"
              image={top.image}
              alt="Top"
              sx={{ width: "200px", height: "auto", borderRadius: "4px" }}
            />
          )}
          {bottom && (
            <CardMedia
              component="img"
              image={bottom.image}
              alt="Bottom"
              sx={{ width: "200px", height: "auto", borderRadius: "4px" }}
            />
          )}
          {shoe && (
            <CardMedia
              component="img"
              image={shoe.image}
              alt="Shoes"
              sx={{ width: "200px", height: "auto", borderRadius: "4px" }}
            />
          )}
        </Box>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#FFE4E1",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "#FF69B4",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        Explore Random Outfits
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          gap: "16px",
          paddingBottom: "16px",
        }}
      >
        {randomOutfits.length > 0 ? (
          randomOutfits.map((outfit, index) => renderOutfitCard(outfit, index))
        ) : (
          <Typography variant="body1" sx={{ color: "#FF69B4" }}>
            Loading outfits...
          </Typography>
        )}
      </Box>
      <Button
        variant="contained"
        sx={{
          marginTop: "16px",
          backgroundColor: "#FF69B4",
          color: "#fff",
          "&:hover": { backgroundColor: "#FF1493" },
        }}
        onClick={() => window.location.reload()} // Refresh outfits
      >
        Refresh Suggestions
      </Button>
    </Box>
  );
};

export default ExplorePage;

import React, { useState, useEffect } from "react";
import { Box, Card, CardMedia, Typography, CircularProgress } from "@mui/material";
import { fetchClothesByIds } from "../service/clothes"; // Function to fetch items by IDs

const OutfitCard = ({ outfitItemIds }) => {
  const [outfitItems, setOutfitItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOutfitItems = async () => {
      try {
        setLoading(true);
        const items = await fetchClothesByIds(outfitItemIds); // Fetch item details
        setOutfitItems(items);
      } catch (error) {
        console.error("Error fetching outfit items:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (outfitItemIds.length > 0) {
      loadOutfitItems();
    }
  }, [outfitItemIds]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "16px",
        backgroundColor: "#fff",
      }}
    >
      {outfitItems.map((item, index) => (
        <Box key={index} sx={{ width: "120px" }}>
          <CardMedia
            component="img"
            image={item.image} // The public URL for the item's image
            alt={item.name}
            sx={{
              borderRadius: "8px",
              height: "120px",
              width: "120px",
              objectFit: "cover",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              marginTop: "8px",
              textAlign: "center",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            {item.name}
          </Typography>
        </Box>
      ))}
    </Card>
  );
};

export default OutfitCard;

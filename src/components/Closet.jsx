import React, { useEffect, useState, useCallback, useContext } from "react";
import { Box, Typography, TextField, MenuItem } from "@mui/material";
import Grid2 from "@mui/material/Grid2"; // Use stable Grid2
import ClothingCard from "./ClothingCard";
import { fetchClothes } from "../service/clothes"; // Import the function
import { GARMENT_TYPES, SEASONS } from "../service/constants"; // Import constants
import { AuthContext } from "./Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Closet = () => {
  const { user, loading } = useContext(AuthContext); // Access user from context
  const [clothes, setClothes] = useState([]);
  const [filteredClothes, setFilteredClothes] = useState([]);
  const [pageLoading, setLoading] = useState(true);
  const [selectedGarmentType, setSelectedGarmentType] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login"); // Redirect to login if user is not authenticated
      return;
    }

    const loadClothes = async () => {
      setLoading(true);
      try {
        const data = await fetchClothes(); // Use fetchClothes function
        setClothes(data);
        setFilteredClothes(data); // Initialize filtered clothes
      } catch (error) {
        console.error("Error loading clothes:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadClothes();
  }, []);

  const handleFilterChange = useCallback(() => {
    let filtered = clothes;
  
    if (selectedGarmentType) {
      filtered = filtered.filter(
        (item) => item.garment_type === selectedGarmentType
      );
    }
  
    if (selectedSeason) {
      filtered = filtered.filter((item) => item.season === selectedSeason);
    }
  
    setFilteredClothes(filtered);
  }, [clothes, selectedGarmentType, selectedSeason]); // Add missing dependencies
  
  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]); // Add 'handleFilterChange' as a dependency
  
  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#FFE4E1",
        minHeight: "100vh",
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
        My Closet
      </Typography>

      {/* Filter Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "24px",
          gap: "16px",
        }}
      >
        {/* Filter by Garment Type */}
        <TextField
          select
          label="Filter by Garment Type"
          value={selectedGarmentType}
          onChange={(e) => setSelectedGarmentType(e.target.value)}
          sx={{ minWidth: "200px" }}
        >
          <MenuItem value="">All</MenuItem>
          {GARMENT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        {/* Filter by Season */}
        <TextField
          select
          label="Filter by Season"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          sx={{ minWidth: "200px" }}
        >
          <MenuItem value="">All</MenuItem>
          {SEASONS.map((season) => (
            <MenuItem key={season} value={season}>
              {season}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {pageLoading ? (
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Loading...
        </Typography>
      ) : (
        <Grid2 container spacing={2}>
          {filteredClothes.map((item) => (
            <Grid2 item xs={12} sm={6} md={4} key={item.id}>
              <ClothingCard
                name={item.name}
                frontPhotoName={item.front_photo}
              />
            </Grid2>
          ))}
        </Grid2>
      )}
    </Box>
  );
};

export default Closet;

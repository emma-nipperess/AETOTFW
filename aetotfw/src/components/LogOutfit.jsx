import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  Card,
  CardMedia,
  CardContent,
  Grid2,
} from "@mui/material";
import { fetchClothes } from "../service/clothes";
import { recordOutfit, checkPreviousOutfits } from "../service/outfits";

const LogOutfit = () => {
  const [clothes, setClothes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [wearToday, setWearToday] = useState(true);
  const [wearDate, setWearDate] = useState(new Date());
  const [purpose, setPurpose] = useState("");
  const [crowd, setCrowd] = useState("");
  const [flaggedOutfits, setFlaggedOutfits] = useState([]);
  const [outfitBuilder, setOutfitBuilder] = useState({
    Shirt: null,
    Pants: null,
    Shoes: null,
    Dress: null,
  });

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [modalCategory, setModalCategory] = useState("");

  useEffect(() => {
    const loadClothes = async () => {
      try {
        const data = await fetchClothes();
        console.log(data, clothes)
        setClothes(data);
      } catch (error) {
        console.error("Error loading clothes:", error.message);
      }
    };

    loadClothes();
  }, []);

  const handleItemSelect = (item, type) => {
    const newOutfit = { ...outfitBuilder };

    if (type === "Dress") {
      newOutfit.Shirt = null;
      newOutfit.Pants = null;
      newOutfit.Dress = item;
    } else {
      newOutfit.Dress = null;
      newOutfit[type] = item;
    }
    console.log("selecting something", item)

    setOutfitBuilder(newOutfit);

    setSelectedItems((prev) =>
      prev.includes(item.id) ? prev : [...prev, item.id]
    );
    setOpenModal(false); // Close the modal after selection
  };

  const handleOpenModal = (category) => {
    setModalCategory(category);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      await recordOutfit({
        outfit_items: selectedItems,
        wear_date: wearToday ? new Date() : wearDate,
        purpose,
        crowd: crowd.split(",").map((person) => person.trim()),
      });

      const flagged = await checkPreviousOutfits(selectedItems, crowd);
      setFlaggedOutfits(flagged);

      alert("Outfit recorded successfully!");
    } catch (error) {
      console.error("Error recording outfit:", error.message);
    }
  };

  const filteredClothes = modalCategory
    ? clothes.filter((item) => item.garment_type === modalCategory)
    : clothes;

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#FFE4E1",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      {/* Form Section */}
      <Box sx={{ flex: 1, maxWidth: "400px", marginRight: "20px" }}>
        <Typography
          variant="h4"
          sx={{
            color: "#FF69B4",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Log Your Outfit
        </Typography>

        <Typography> Outfit for when: </Typography>
        <ReactDatePicker
          selected={wearToday ? new Date() : wearDate}
          onChange={(date) => setWearDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
        />

        <TextField
          label="Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          fullWidth
          sx={{ marginBottom: "16px", marginTop: "16px" }}
        />
        <TextField
          label="Crowd (comma-separated)"
          value={crowd}
          onChange={(e) => setCrowd(e.target.value)}
          fullWidth
          sx={{ marginBottom: "16px" }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FF69B4",
            color: "#fff",
            "&:hover": { backgroundColor: "#FF1493" },
          }}
          onClick={handleSubmit}
        >
          Record Outfit
        </Button>
      </Box>

      {/* Outfit Builder Section */}
      <Box sx={{ flex: 2 }}>
        <Typography
          variant="h5"
          sx={{ textAlign: "center", marginBottom: "16px", color: "#FF69B4" }}
        >
          Outfit Builder
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Shirt or Dress */}
          <Box
            sx={{
              width: "300px",
              height: "150px",
              border: "2px dashed #FF69B4",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {outfitBuilder.Shirt && (
              <img
                src={outfitBuilder.Shirt.image}
                alt="Shirt"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            )}
            {outfitBuilder.Dress && (
              <img
                src={outfitBuilder.Dress.image}
                alt="Dress"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            )}
            <Button
              variant="outlined"
              sx={{
                position: "absolute",
                color: "#FF69B4",
                borderColor: "#FF69B4",
              }}
              onClick={() => handleOpenModal("Shirt")}
            >
              Select Shirt
            </Button>
          </Box>

          {/* Pants */}
          <Box
            sx={{
              width: "300px",
              height: "150px",
              border: "2px dashed #FF69B4",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {outfitBuilder.Pants && (
              <img
                src={outfitBuilder.Pants.image}
                alt="Pants"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            )}
            <Button
              variant="outlined"
              sx={{
                position: "absolute",
                color: "#FF69B4",
                borderColor: "#FF69B4",
              }}
              onClick={() => handleOpenModal("Pants")}
            >
              Select Pants
            </Button>
          </Box>

          {/* Shoes */}
          <Box
            sx={{
              width: "300px",
              height: "150px",
              border: "2px dashed #FF69B4",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {outfitBuilder.Shoes && (
              <img
                src={outfitBuilder.Shoes.image}
                alt="Shoes"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            )}
            <Button
              variant="outlined"
              sx={{
                position: "absolute",
                color: "#FF69B4",
                borderColor: "#FF69B4",
              }}
              onClick={() => handleOpenModal("Shoes")}
            >
              Select Shoes
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Modal for selecting items */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "20px",
            maxWidth: "600px",
            margin: "50px auto",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginBottom: "16px", color: "#FF69B4" }}
          >
            Select {modalCategory.charAt(0).toUpperCase() + modalCategory.slice(1)}
          </Typography>
          <Grid2 container spacing={2}>
            {filteredClothes.map((item) => (
              <Grid2 item xs={6} key={item.id}>
                <Card onClick={() => handleItemSelect(item, modalCategory)}>
                  <CardMedia
                    component="img"
                    height="100"
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography>{item.name}</Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Modal>
    </Box>
  );
};

export default LogOutfit;

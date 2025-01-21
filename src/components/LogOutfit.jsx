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
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { fetchClothes, getItemImage } from "../service/clothes";
import { recordOutfit, checkPreviousOutfits } from "../service/outfits";
import { getCurrentUserId } from "../service/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OUTFIT_STATUS } from "../service/constants"

const LogOutfit = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryDate = searchParams.get("date"); // Get 'date' from query params
  const [clothes, setClothes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [wearDate, setWearDate] = useState(queryDate ? new Date(queryDate) : new Date());
  const [purpose, setPurpose] = useState("");
  const [crowd, setCrowd] = useState("");
  const [status, setStatus] = useState(OUTFIT_STATUS[0]);
  const [flaggedOutfits, setFlaggedOutfits] = useState([]);
  const [outfitBuilder, setOutfitBuilder] = useState({
    Shirt: null,
    Pants: null,
    Shoes: null,
    Dress: null,
    Jumper: null,
  });

  // State for visibility toggle
  const [useDressMode, setUseDressMode] = useState(false);
  const [showJumperBox, setShowJumperBox] = useState(false);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [modalCategory, setModalCategory] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("");

  useEffect(() => {
    const loadClothesWithImages = async () => {
      try {
        const data = await fetchClothes();

        // Fetch public URLs for each clothing item's front photo
        const clothesWithImages = await Promise.all(
          data.map(async (item) => {
            const imageUrl = await getItemImage(item.front_photo); // Get the image URL
            return { ...item, image: imageUrl };
          })
        );

        setClothes(clothesWithImages);
      } catch (error) {
        console.error("Error loading clothes:", error.message);
      }
    };

    loadClothesWithImages();
  }, []);

  const handleItemSelect = (item, type) => {
    const newOutfit = { ...outfitBuilder };

    if (type === "Dress") {
      newOutfit.Shirt = null;
      newOutfit.Pants = null;
      newOutfit.Jumper = null;
      newOutfit.Dress = item;
    } else {
      newOutfit.Dress = null;
      newOutfit[type] = item;
    }

    setOutfitBuilder(newOutfit);

    setSelectedItems((prev) =>
      prev.includes(item.id) ? prev : [...prev, item.id]
    );
    setOpenModal(false); // Close the modal after selection
  };

  const handleOpenModal = (category) => {
    setModalCategory(category);
    setCurrentFilter(""); // Reset filter on modal open
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      const uid = await getCurrentUserId();

      await recordOutfit({
        outfit_items: selectedItems,
        wear_date: wearDate,
        purpose,
        crowd: crowd.split(",").map((person) => person.trim()),
        status
      }, uid);

      const flagged = await checkPreviousOutfits(selectedItems, crowd);
      setFlaggedOutfits(flagged);

      setShowSuccessModal(true);
      
    } catch (error) {
      console.error("Error recording outfit:", error.message);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    if (queryDate) {
      navigate(`/calendar`);
    } else {
      navigate("/");
    }
  };

  const garmentTypeMapping = {
    Shirt: ["T-Shirt", "Long sleeve", "Singlet", "Blouse", "Jacket", "Sweater"],
    Pants: ["Pants", "Shorts", "Skirt"],
    Jumper: ["Sweater", "Jacket"],
  };
  
  const filteredClothes = clothes.filter((item) => {
    const mappedTypes = garmentTypeMapping[modalCategory] || [modalCategory];
    if (currentFilter) {
      return mappedTypes.includes(item.garment_type) && item.garment_type === currentFilter;
    }
    return mappedTypes.includes(item.garment_type);
  });
  
  
  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#FFE4E1",
        minHeight: "100vh",
        display: "flex",
        flexWrap: "wrap"
      }}
    >
      {/* Form Section */}
      <Box sx={{ flex: 1, maxWidth: "400px", minWidth: "300px", marginRight: "20px" }}>
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

        <ReactDatePicker
          selected={wearDate} // Bind the date picker to wearDate
          onChange={(date) => setWearDate(date)} // Update wearDate when the user selects a date
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
           {/* Status Selection */}
           <FormControl fullWidth sx={{ marginBottom: "16px" }}>
         <Typography> Status </Typography>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {OUTFIT_STATUS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
       
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
          {!useDressMode ? (
            <>
              {/* Shirt */}
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

              {/* Jumper */}
              {showJumperBox && (
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
                  {outfitBuilder.Jumper && (
                    <img
                      src={outfitBuilder.Jumper.image}
                      alt="Jumper"
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
                    onClick={() => handleOpenModal("Jumper")}
                  >
                    Select Jumper
                  </Button>
                </Box>
              )}
              {!showJumperBox && (
                <Button
                  variant="outlined"
                  sx={{
                    color: "#FF69B4",
                    borderColor: "#FF69B4",
                  }}
                  onClick={() => {
                    setShowJumperBox(true)
                    outfitBuilder.Jumper = ""
                  }
                }
                >
                  Add Jumper
                </Button>
              )}
            </>
          ) : (
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
                onClick={() => handleOpenModal("Dress")}
              >
                Select Dress
              </Button>
            </Box>
          )}

          {/* Button to toggle between modes */}
          <Button
            variant="outlined"
            sx={{
              color: "#FF69B4",
              borderColor: "#FF69B4",
              marginTop: "16px",
            }}
            onClick={() => setUseDressMode(!useDressMode)}
          >
            {useDressMode ? "Switch to Shirt & Pants" : "Want to Spread Your Legs?"}
          </Button>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FF69B4",
            margin: "20px",
            color: "#fff",
            "&:hover": { backgroundColor: "#FF1493" },
          }}
          onClick={handleSubmit}
        >
          Record Outfit
        </Button>
      </Box>
      

      {/* Modal for selecting items */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "20px",
            width: "75%", // Width relative to viewport width
            height: "85vh", // Fixed height as 90% of viewport height
            overflowY: "auto", // Enable vertical scrolling
            margin: "50px auto",
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)", // Optional shadow
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginBottom: "16px", color: "#FF69B4" }}
          >
            Select {modalCategory}
          </Typography>

            {/* Filter Dropdown */}
          <FormControl fullWidth sx={{ marginBottom: "16px" }}>
            <Select
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {garmentTypeMapping[modalCategory]?.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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


      {/* Success Modal */}
      <Modal open={showSuccessModal} onClose={handleCloseSuccessModal}>
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "30px",
            maxWidth: "500px",
            margin: "50px auto",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#4CAF50",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            🎉 Outfit Recorded!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#555",
              marginBottom: "24px",
            }}
          >
            Your outfit has been successfully saved. You can now view it in the calendar!
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FF69B4",
              color: "#fff",
              "&:hover": { backgroundColor: "#FF1493" },
            }}
            onClick={handleCloseSuccessModal}
          >
            Back to Calendar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default LogOutfit;

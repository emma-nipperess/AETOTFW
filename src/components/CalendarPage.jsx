import React, { useState, useEffect } from "react";
import "../App.css"
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import { Box, Typography, Button, Modal, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchOutfitsByDate } from "../service/outfits";
import OutfitCard from "./OutfitCard";
import { useContext } from "react";
import { AuthContext } from "./Auth/AuthContext";

const CalendarPage = () => {
  const { user, loading } = useContext(AuthContext); // Access user from context
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());
  const [outfits, setOutfits] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login"); // Redirect to login if user is not authenticated
      return;
    }

    if (selectedDay) {
      console.log("Selected Day:", selectedDay);
    }
  }, [selectedDay]); // Runs whenever `selectedDay` changes

  
  useEffect(() => {const loadOutfits = async () => {
    try {
      const data = await fetchOutfitsByDate("2024-01-01", "2025-06-30");
      const mappedOutfits = data.reduce((acc, outfit) => {
        
        const date = new Date(outfit.wear_date); 
        // i have no idea why i have to do this and it enrages me moderately but its fine
        date.setDate(date.getDate() - 1);
        const normalizedDate = date.toISOString().split("T")[0]; // Get only the date part
        acc[normalizedDate] = outfit;
        return acc;
      }, {});
  
      console.log(mappedOutfits);
      setOutfits(mappedOutfits);
    } catch (error) {
      console.error("Error fetching outfits:", error.message);
    }
  };  

    loadOutfits();
  }, []);

  const handleDayClick = (date) => {
    setSelectedDay(date);
    setOpenModal(true); // Open modal for logging or viewing outfits
  };

  const handleAddOutfit = () => {
    const nextDay = new Date(selectedDay);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayFormatted = nextDay.toISOString().split("T")[0];

    navigate(`/outfit?date=${nextDayFormatted}`);
  };

  const renderTileContent = ({ date }) => {
    // Normalize calendar date to UTC format
    const normalizedDate = date.toISOString().split("T")[0]; // Get YYYY-MM-DD
    const outfit = outfits[normalizedDate]; // Match against normalized dates
  
    if (outfit) {
      console.log("Date in Tile:", normalizedDate);
  
      return (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "100%",
              backgroundColor:
                outfit.status === "worn"
                  ? "#FF69B4"
                  : outfit.status === "planned"
                  ? "#FFD700"
                  : "#D3D3D3",
              color: "#fff",
              textAlign: "center",
              fontSize: "0.8em",
              zIndex: 1,
            }}
          >
            {outfit.status}
          </Box>
        </Box>
      );
    }
  
    return null;
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
        Outfit Calendar
      </Typography>

      <Calendar
        value={currentDate}
        onClickDay={handleDayClick}
        tileContent={renderTileContent}
        tileClassName="calendar-tile"
      />

      {/* Modal for Day Details */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
            sx={{
            backgroundColor: "#fff",
            padding: "20px",
            maxWidth: "400px",
            margin: "50px auto",
            borderRadius: "8px",
            }}
        >
            <Typography variant="h6" sx={{ marginBottom: "16px" }}>
            {selectedDay ? selectedDay.toDateString() : "Day Details"}
            </Typography>

            {selectedDay && outfits[selectedDay.toISOString().split("T")[0]] ? (
            <Box>
                <Card>
                <CardContent>
                    <Typography variant="body1">
                    <strong>Status:</strong>{" "}
                    {outfits[selectedDay.toISOString().split("T")[0]].status}
                    </Typography>
                    <Typography variant="body1">
                    <strong>Purpose:</strong>{" "}
                    {outfits[selectedDay.toISOString().split("T")[0]].purpose}
                    </Typography>
                    <Typography variant="body1">
                    <strong>Items:</strong>
                    </Typography>
                    {/* Render OutfitCard with outfit_items */}
                    <OutfitCard
                    outfitItemIds={
                        outfits[selectedDay.toISOString().split("T")[0]].outfit_items
                    }
                    />
                </CardContent>
                </Card>
            </Box>
            ) : (
            <Typography variant="body2" sx={{ marginBottom: "16px" }}>
                No outfit recorded for this day.
            </Typography>
            )}

            <Button
            variant="contained"
            sx={{
                backgroundColor: "#FF69B4",
                color: "#fff",
                "&:hover": { backgroundColor: "#FF1493" },
                marginTop: "16px",
            }}
            onClick={handleAddOutfit}
            >
            Add Outfit
            </Button>
        </Box>
        </Modal>

    </Box>
  );
};

export default CalendarPage;

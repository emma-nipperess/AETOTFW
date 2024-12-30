import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../service/auth"; // Import auth functions
import Inventory2Icon from "@mui/icons-material/Inventory2"; // Closet icon

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { user, error } = await getCurrentUser();
      if (user) {
        setUser(user); // Set user if authenticated
      } else if (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchUser();
  }, []);

  

  return (
    <Box>
    
      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 64px)", // Adjust height for the AppBar
          backgroundColor: "#FFE4E1",
          padding: "20px",
        }}
      >
        <Typography
          variant="h2"
          sx={{ color: "#FF69B4", marginBottom: "16px", textAlign: "center" }}
        >
          🪵 your clothes
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#333", marginBottom: "24px", textAlign: "center" }}
        >
          Greetings Future Emma - Emma 12/12/2024
        </Typography>
        {!user && (
          <Box sx={{ display: "flex", gap: "16px" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FF69B4",
                color: "#fff",
                "&:hover": { backgroundColor: "#FF1493" },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#FF69B4",
                color: "#FF69B4",
                "&:hover": { borderColor: "#FF1493", color: "#FF1493" },
              }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </Box>
        )}

        {user && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#333",
                marginTop: "24px",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              Logged in as {user.email}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Inventory2Icon />} // Add icon
              sx={{
                backgroundColor: "#FF69B4",
                color: "#fff",
                "&:hover": { backgroundColor: "#FF1493" },
                borderRadius: "20px",
                fontWeight: "bold",
                textTransform: "none", // Prevent uppercase text
              }}
              onClick={() => navigate("/closet")} // Navigate to the closet page
            >
              Open Closet
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;

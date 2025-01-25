import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../service/auth"; // Import auth functions
import Inventory2Icon from "@mui/icons-material/Inventory2"; // Closet icon
import { useContext } from "react";
import { AuthContext } from "./Auth/AuthContext";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const { user: isLogged, loading } = useContext(AuthContext); // Access user from context

  useEffect(() => {
    if (!isLogged && !loading) {
      navigate("/login"); // Redirect to login if user is not authenticated
      return;
    }

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
                  <Typography
          variant="body1"
          sx={{ color: "#333", fontSize: "10px", marginBottom: "15px", textAlign: "center", maxWidth: "200px" }}
        >
         If you are not Emma and you have somehow stumbled upon this page, I have news for you. You cannot sign up. There is no way that I am aware of where you can use any part of this application. It's not that I would even expect you to have wanted to, but I can't be bothered with all the potential security risks that COULD arise with other users.
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

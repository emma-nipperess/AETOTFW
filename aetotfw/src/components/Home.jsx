import React, { useState, useEffect } from "react";
import { Box, Typography, Button, AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../service/auth"; // Import auth functions

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

  const handleLogout = async () => {
    const { error } = await logoutUser();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      setUser(null); // Clear user state
      navigate("/"); // Reload the home page
    }
  };

  return (
    <Box>
      {/* Top Navigator */}
      <AppBar position="static" sx={{ backgroundColor: "#FF69B4" }}>
  <Toolbar sx={{ justifyContent: "space-between" }}>
    {/* White button with pink text */}
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#fff",
        color: "#FF69B4", // Pink text
        borderRadius: "20px", // Circular shape
        minWidth: "40px",
        height: "40px",
        fontSize: "20px",
        fontWeight: "bold",
        textTransform: "none", // Prevent uppercase text
        "&:hover": {
          backgroundColor: "#F5F5F5", // Light hover effect
        },
      }}
      onClick={() => navigate("/")} // Optional click handler
    >
      αetotfw 🐀
    </Button>

    {/* Title with pink color */}
    <Typography
      variant="h6"
      sx={{
        color: "#fff",
        fontWeight: "bold",
      }}
    >
     🪵 your clothes
    </Typography>

    {/* Right-side button */}
    {user ? (
      <Button sx={{ color: "#fff" }} onClick={handleLogout}>
        Logout
      </Button>
    ) : (
      <Button sx={{ color: "#fff" }} onClick={() => navigate("/login")}>
        Login
      </Button>
    )}
  </Toolbar>
</AppBar>



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
        )}
      </Box>
    </Box>
  );
};

export default Home;

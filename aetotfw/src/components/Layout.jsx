import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { getCurrentUser, logoutUser } from "../service/auth"; // Import auth functions
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2Icon from "@mui/icons-material/Inventory2"; // Closet icon
import UploadIcon from "@mui/icons-material/Upload"; // Upload icon
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Calendar icon
import CheckroomIcon from "@mui/icons-material/Checkroom"; // Log an Outfit icon

const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
              borderRadius: "20px", // Rounded shape
              minWidth: "40px",
              height: "40px",
              fontSize: "20px",
              fontWeight: "bold",
              textTransform: "none", // Prevent uppercase text
              "&:hover": {
                backgroundColor: "#F5F5F5", // Light hover effect
              },
            }}
            onClick={() => navigate("/")} // Navigate to home
          >
            αetotfw 🐀
          </Button>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            🪵 your clothes
          </Typography>

          {/* User-Specific Buttons */}
          {user ? (
            <Box sx={{ display: "flex", gap: "16px" }}>
              {/* Open Closet */}
              <Button
                variant="outlined"
                startIcon={<Inventory2Icon />}
                sx={{
                  borderColor: "#fff",
                  color: "#fff",
                  textTransform: "none", // Prevent uppercase text
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "#FF69B4",
                    backgroundColor: "#FF69B4",
                    color: "#fff",
                  },
                }}
                onClick={() => navigate("/closet")}
              >
                Open Closet
              </Button>

              {/* Upload a Clothe */}
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                sx={{
                  backgroundColor: "#fff",
                  color: "#FF69B4",
                  textTransform: "none", // Prevent uppercase text
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
                onClick={() => navigate("/upload")}
              >
                Upload a Clothe
              </Button>

              {/* Calendar */}
              <Button
                variant="contained"
                startIcon={<CalendarTodayIcon />}
                sx={{
                  backgroundColor: "#fff",
                  color: "#FF69B4",
                  textTransform: "none", // Prevent uppercase text
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
                onClick={() => navigate("/calendar")}
              >
                Calendar
              </Button>

              {/* Log an Outfit */}
              <Button
                variant="contained"
                startIcon={<CheckroomIcon />}
                sx={{
                  backgroundColor: "#fff",
                  color: "#FF69B4",
                  textTransform: "none", // Prevent uppercase text
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
                onClick={() => navigate("/outfit")}
              >
                Log an Outfit
              </Button>

              {/* Logout */}
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                sx={{
                  borderColor: "#fff",
                  color: "#fff",
                  textTransform: "none", // Prevent uppercase text
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "#FF69B4",
                    backgroundColor: "#FF69B4",
                    color: "#fff",
                  },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{
                backgroundColor: "#fff",
                color: "#FF69B4",
                textTransform: "none", // Prevent uppercase text
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Render page content */}
      <Outlet />
    </Box>
  );
};

export default Layout;

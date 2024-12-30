import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box, IconButton } from "@mui/material";
import { getCurrentUser, logoutUser } from "../service/auth";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import UploadIcon from "@mui/icons-material/Upload";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import MenuIcon from "@mui/icons-material/Menu";

const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { user, error } = await getCurrentUser();
      if (user) {
        setUser(user);
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
      setUser(null);
      navigate("/");
    }
  };

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <Box>
      {/* Top Navigator */}
      <AppBar position="static" sx={{ backgroundColor: "#FF69B4" }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          {/* Logo */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fff",
              color: "#FF69B4",
              borderRadius: "20px",
              minWidth: "40px",
              height: "40px",
              fontSize: "20px",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "#F5F5F5" },
              marginBottom: { xs: "8px", sm: "0" },
            }}
            onClick={() => navigate("/")}
          >
            αetotfw 🐀
          </Button>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              marginBottom: { xs: "8px", sm: "0" },
            }}
          >
            🪵 your clothes
          </Typography>

          {/* Menu Button for Small Devices */}
          <IconButton
            sx={{
              display: { xs: "flex", sm: "none" },
              color: "#fff",
            }}
            onClick={handleToggleMenu}
          >
            <MenuIcon />
          </IconButton>

          {/* User-Specific Buttons */}
          <Box
            sx={{
              display: { xs: menuOpen ? "flex" : "none", sm: "flex" },
              flexDirection: { xs: "column", sm: "row" },
              gap: "16px",
              alignItems: "flex-start",
              marginTop: { xs: "8px", sm: "0" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {user ? (
              <>
                {/* Open Closet */}
                <Button
                  variant="outlined"
                  startIcon={<Inventory2Icon />}
                  sx={{
                    borderColor: "#fff",
                    color: "#fff",
                    textTransform: "none",
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
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#F5F5F5" },
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
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#F5F5F5" },
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
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#F5F5F5" },
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
                    textTransform: "none",
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
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: "#fff",
                  color: "#FF69B4",
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#F5F5F5" },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Render page content */}
      <Outlet />
    </Box>
  );
};

export default Layout;

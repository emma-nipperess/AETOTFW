import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import UploadIcon from "@mui/icons-material/Upload";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import LoginIcon from "@mui/icons-material/Login";
import { getCurrentUser, logoutUser } from "../service/auth";
import { useAuth } from "./Auth/AuthContext";

const Layout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth(); // Use user and setUser from AuthContext
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await logoutUser();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      setUser(null); // Clear the user from AuthContext
      navigate("/"); // Redirect to home
    }
  };


  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Box>
      {/* Top Navigator */}
      <AppBar position="static" sx={{ backgroundColor: "#FF69B4" }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
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
            }}
            onClick={() => navigate("/")}
          >
            αetotfw 🐀
          </Button>

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

          {/* User-Specific Buttons for Large Devices */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: "16px",
            }}
          >
            {user ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Inventory2Icon />}
                  sx={{
                    backgroundColor: "#fff",
                    color: "#FF69B4",
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#F5F5F5" },
                  }}
                  onClick={() => navigate("/closet")}
                >
                  Open Closet
                </Button>
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

      {/* Side Menu for Small Devices */}
      <Drawer anchor="right" open={menuOpen} onClose={handleToggleMenu}>
      <Box sx={{ width: 250 }}>
        <List>
          {user ? (
            <>
              <ListItem
                button
                onClick={() => {
                  navigate("/closet");
                  setMenuOpen(false); // Close the menu
                }}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Open Closet" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate("/upload");
                  setMenuOpen(false); // Close the menu
                }}
              >
                <ListItemIcon>
                  <UploadIcon />
                </ListItemIcon>
                <ListItemText primary="Upload a Clothe" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate("/calendar");
                  setMenuOpen(false); // Close the menu
                }}
              >
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText primary="Calendar" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  navigate("/outfit");
                  setMenuOpen(false); // Close the menu
                }}
              >
                <ListItemIcon>
                  <CheckroomIcon />
                </ListItemIcon>
                <ListItemText primary="Log an Outfit" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false); // Close the menu
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <ListItem
              button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false); // Close the menu
              }}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>


      {/* Render page content */}
      <Outlet />
    </Box>
  );
};

export default Layout;

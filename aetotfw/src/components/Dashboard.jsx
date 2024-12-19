import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../service/auth";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { user, error } = await getCurrentUser();
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        console.error("User not authenticated:", error?.message);
        navigate("/login"); // Redirect to login if user not authenticated
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#FCE4EC",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#FFF0F5",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "#FF69B4",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Welcome Back, {user.email}!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#555",
          marginBottom: "24px",
          maxWidth: "500px",
        }}
      >
        This is your dashboard where you can manage your wardrobe, log outfits,
        and explore your style history.
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#FF69B4",
          color: "#fff",
          padding: "10px 20px",
          "&:hover": { backgroundColor: "#FF1493" },
        }}
        onClick={() => navigate("/")}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default Dashboard;

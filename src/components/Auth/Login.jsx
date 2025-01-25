import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { loginUser } from "../../service/auth"; // Import the login function from auth.js
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Access the setUser function from AuthContext

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null); // Reset error state before login attempt

    const { session, error } = await loginUser(email, password);

    if (error) {
      setError(error.message); // Display error to the user
    } else {
      console.log("Logged in successfully:", email);
       // Update the AuthContext with the logged-in user's information
      setUser(email); // Assuming `session.user` contains user data
      console.log(session)
      //window.dispatchEvent(new CustomEvent("userLoggedIn", { detail: email }));
      // Redirect to dashboard or homepage after login
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "400px",
        margin: "auto",
        marginTop: "100px",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "#FF69B4" }}>
        Welcome Back!
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: "16px" }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: "24px" }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#FF69B4",
            color: "#fff",
            padding: "10px 0",
            "&:hover": { backgroundColor: "#FF1493" },
          }}
        >
          Login
        </Button>
      </form>
      {error && (
        <Typography variant="body2" sx={{ marginTop: "16px", color: "red" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Login;

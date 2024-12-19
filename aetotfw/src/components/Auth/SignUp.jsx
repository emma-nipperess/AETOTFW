import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { signUpUser } from "../../service/auth"; // Import the sign-up function from auth.js

const SignUp = () => {
  const [name, setName] = useState(""); // State for name (if you plan to store it later)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError(null); // Reset error state before attempting sign-up

    const { user, error } = await signUpUser(email, password);

    if (error) {
      setError(error.message); // Display error to the user
    } else {
      console.log("Signed up successfully:", user);
      // You can store the name in your database if needed
      // Redirect to login or dashboard after successful sign-up
      window.location.href = "/login"; // Example redirect
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
        Create an Account
      </Typography>
      <form onSubmit={handleSignUp}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginBottom: "16px" }}
        />
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
          Sign Up
        </Button>
      </form>
      {error && (
        <Typography variant="body2" sx={{ marginTop: "16px", color: "red" }}>
          {error}
        </Typography>
      )}
      <Typography variant="body2" sx={{ marginTop: "16px" }}>
        Already have an account?{" "}
        <Link href="/login" sx={{ color: "#FF69B4", fontWeight: "bold" }}>
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUp;

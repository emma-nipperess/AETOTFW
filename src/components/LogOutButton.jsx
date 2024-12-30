import React from "react";
import { logoutUser } from "./service/auth";

const LogoutButton = () => {
  const handleLogout = async () => {
    const { error } = await logoutUser();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      console.log("Logged out successfully");
      // Redirect to login page
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;

import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser, logoutUser } from "../../service/auth";

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the current user on mount
    const fetchUser = async () => {
      const { user, error } = await getCurrentUser();
      if (user) {
        setUser(user);
      } else if (error) {
        console.error("Error fetching user:", error.message);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const logout = async () => {
    const { error } = await logoutUser();
    if (!error) setUser(null);
    else console.error("Error logging out:", error.message);
  };

  
  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
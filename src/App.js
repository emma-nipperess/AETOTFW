import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Home from "./components/Home";
import UploadClothes from "./components/UploadClothes";
import Closet from "./components/Closet";
import Layout from "./components/Layout";
import LogOutfit from "./components/LogOutfit";
import ExplorePage from "./components/ExplorePage";
import CalendarPage from "./components/CalendarPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF69B4", // Pink
    },
  },
});

function App() {
  const [user, setUser] = React.useState(null);

  const handleLogout = () => {
    // Add your logout logic here
    setUser(null);
  };
  return (
    <ThemeProvider theme={theme}>
      <Router basename="/AETOTFW">
        <Routes>
          <Route element={<Layout user={user} handleLogout={handleLogout} />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/upload" element={<UploadClothes />} />
            <Route path="/closet" element={<Closet />} />
            <Route path="/outfit" element={<LogOutfit />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/explore" element={<ExplorePage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

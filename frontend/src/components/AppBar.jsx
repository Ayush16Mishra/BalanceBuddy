import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Box, Container, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AppAppBar = () => {
  const [shrink, setShrink] = useState(false);
  const theme = useTheme(); // Get theme context
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShrink(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <AppBar
        position="fixed"
        sx={{
          borderRadius: 9,
          boxShadow: 3,
          width: "90%",
          margin: "16px auto",
          top: "16px",
          left: 0,
          right: 0,
          backgroundColor: "rgba(255, 255, 255, 0.3)", // Semi-transparent white
          color: theme.palette.text.primary, // Inherit text color based on theme
          transition: "all 0.3s ease-in-out",
          height: shrink ? "50px" : "80px",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center", minHeight: "inherit", paddingY: 1 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", paddingY: 1 }}>
           
          </Box>

          {/* Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", paddingY: 1 }}>
            <Button
             onClick={() => navigate("/login")}
              sx={{
                color: theme.palette.text.primary,
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              Login
            </Button>
            <Button
             onClick={() => navigate("/signup")}
              sx={{
                color: theme.palette.text.primary,
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default AppAppBar;

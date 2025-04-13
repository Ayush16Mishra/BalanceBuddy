// LoginPage.jsx
import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL;

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Login Response:", data);
      if (response.ok) {
        alert("Login successful!");
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again later.");
    }finally {
      setLoading(false); // End loading
    }
  };

  const handleSignupRedirect = () => {
    setIsLeaving(true);
    setTimeout(() => {
      navigate("/signup");
    }, 500);
  };

  
  const handleForgotPasswordRedirect = () => {
    navigate("/forgotPassword");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url('/sibg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              textAlign: "center",
              background: "rgba(26, 26, 46, 0.9)",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Log In
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Welcome back! Log in to continue managing your projects.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555" },
                      "&:hover fieldset": { borderColor: "#777" },
                      "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
                    },
                  }}
                />

                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555" },
                      "&:hover fieldset": { borderColor: "#777" },
                      "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
                    },
                  }}
                />

<Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color: "#bb86fc",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={handleForgotPasswordRedirect}
                >
                  Forgot Password?
                </Typography>


                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#9c27b0",
                    "&:hover": { backgroundColor: "#7b1fa2" },
                  }}
                  fullWidth
                  disabled={loading}
                > {loading ? "Logging in..." : "Log In"}
                </Button>
                {loading && (
  <Typography variant="body2" sx={{ mt: 1, color: "#bb86fc" }}>
    Please wait...
  </Typography>
)}
              </Box>
            </form>

            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={isLeaving ? { opacity: 0, scale: 0.8 } : {}}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="body2" sx={{ mt: 2 }}>
                Don't have an account? {" "}
                <span
                  onClick={handleSignupRedirect}
                  style={{
                    color: "#bb86fc",
                    textDecoration: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Sign Up
                </span>
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default LoginPage;

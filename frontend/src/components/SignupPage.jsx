import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful");
        window.location.href = "/login";
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred");
    }
  };

  const handleLoginRedirect = () => {
    setIsLeaving(true);
    setTimeout(() => {
      navigate("/login");
    }, 500); // Matches transition duration
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
          exit={{ opacity: 0, x: -50 }} // Fade out & move left when leaving
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
              Sign Up
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Join us to manage your projects
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Email"
                  placeholder="example@gmail.com"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={formData.email}
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
                  label="Username"
                  variant="outlined"
                  fullWidth
                  name="username"
                  placeholder="example name"
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
                  placeholder="*********"
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

                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  name="confirmPassword"
                  placeholder="*********"
                  value={formData.confirmPassword}
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

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#9c27b0",
                    "&:hover": { backgroundColor: "#7b1fa2" },
                  }}
                  fullWidth
                >
                  Sign Up
                </Button>
              </Box>
            </form>

            {/* Animated Login Link */}
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={isLeaving ? { opacity: 0, scale: 0.8 } : {}}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <span
                  onClick={handleLoginRedirect}
                  style={{
                    color: "#bb86fc",
                    textDecoration: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Log in
                </span>
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default SignupPage;

import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Paper } from "@mui/material";
import { motion } from "framer-motion";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("A password reset link has been sent to your email.");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      console.error("Forgot Password Error:", error);
    }
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
              Forgot Password?
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Enter your email address below, and we'll send you a link to reset your password.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                Send Reset Link
              </Button>
            </form>

            {message && <Typography sx={{ mt: 2, color: "#bb86fc" }}>{message}</Typography>}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default ForgotPasswordPage;

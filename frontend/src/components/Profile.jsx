import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Button, TextField } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const CardContainer = ({ title, children }) => (
  <Paper
    elevation={4}
    sx={{
      padding: 3,
      borderRadius: 2,
      minHeight: "150px",
      backdropFilter: "blur(10px)",
      background: "rgba(255, 255, 255, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
      width: "100%",
      maxWidth: "600px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <Typography variant="h5" fontWeight="bold">{title}</Typography>
    <Box sx={{ mt: 1 }}>{children}</Box>
  </Paper>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/auth/profile`, { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        navigate("/login");
      });
  }, [navigate]);

  const handleSave = () => {
    axios
      .put(`${API_BASE}/api/auth/profile`, { username, email }, { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, textAlign: "center" }}>
        Profile
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <CardContainer title="User Details">
          {isEditing ? (
            <>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="dense"
              />
            </>
          ) : (
            <>
              <Typography variant="h6">Username: {user.username}</Typography>
              <Typography variant="h6">Email: {user.email}</Typography>
            </>
          )}
          <Typography variant="h6">Joined on: {new Date(user.created_at).toLocaleDateString()}</Typography>
        </CardContainer>

        {isEditing ? (
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "rgba(0, 200, 0, 0.7)", color: "white" }}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "rgba(255, 255, 255, 0.3)", color: "black" }}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}

        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "rgba(255, 255, 255, 0.3)", color: "black" }}
          onClick={() => navigate("/resetPassword")}
        >
          Reset Password
        </Button>
      </Box>
    </motion.div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const CardContainer = ({ title, children }) => (
  <Paper
    elevation={5}
    sx={{
      p: 4,
      borderRadius: 4,
      backdropFilter: "blur(12px)",
      background: "rgba(255, 255, 255, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      width: "100%",
      maxWidth: "600px",
    }}
  >
    <Typography variant="h5" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <Box>{children}</Box>
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
      .get(`${API_BASE}/api/auth/profile`)
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
      .put(
        `${API_BASE}/api/auth/profile`,
        { username, email },
        { withCredentials: true }
      )
      .then((response) => {
        setUser(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const hasChanges =
    username !== user?.username || email !== user?.email;

  if (!user)
    return (
      <Typography textAlign="center" mt={5}>
        Loading...
      </Typography>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={4}
      >
        My Profile
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <CardContainer title="Account Information">
          {isEditing ? (
            <Stack spacing={2}>
              <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
            </Stack>
          ) : (
            <Stack spacing={1}>
              <Typography variant="body1">
                <strong>Username:</strong> {user.username}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
            </Stack>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Joined on: {new Date(user.created_at).toLocaleDateString()}
          </Typography>
        </CardContainer>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
  {isEditing ? (
    <Button
      onClick={handleSave}
      sx={{
        textTransform: "none",
        px: 4,
        py: 1.5,
        borderRadius: 3,
        fontWeight: "bold",
        color: "#fff",
        background: "rgba(25, 118, 210, 0.3)", // primary blue tone
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
        "&:hover": {
          background: "rgba(25, 118, 210, 0.5)",
        },
      }}
    >
      Save Changes
    </Button>
  ) : (
    <Button
      onClick={() => setIsEditing(true)}
      sx={{
        textTransform: "none",
        px: 4,
        py: 1.5,
        borderRadius: 3,
        fontWeight: "bold",
        color: "#fff",
        background: "rgba(25, 118, 210, 0.3)", // primary blue tone
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
        "&:hover": {
          background: "rgba(25, 118, 210, 0.5)",
        },
      }}
    >
      Edit Profile
    </Button>
  )}

  <Button
    onClick={() => navigate("/resetPassword")}
    sx={{
      textTransform: "none",
      px: 4,
      py: 1.5,
      borderRadius: 3,
      fontWeight: "bold",
      color: "#fff",
      background: "rgba(156, 39, 176, 0.3)", // secondary purple tone
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
      "&:hover": {
        background: "rgba(156, 39, 176, 0.5)",
      },
    }}
  >
    Reset Password
  </Button>
</Stack>


      </Box>
    </motion.div>
  );
};

export default Profile;

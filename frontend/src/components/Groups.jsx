//groups.jsx
import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, Button, TextField, IconButton  } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const API_BASE_URL = "http://localhost:5000/api/groups";

const CardContainer = ({ title, children, fullWidth = false }) => (
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
      display: "flex",
      flexDirection: "column",
      gap: 2,
      width: fullWidth ? "100%" : "48%",
      maxWidth: fullWidth ? "800px" : "500px",
    }}
  >
    <Typography variant="h5" fontWeight="bold">{title}</Typography>
    {children}
  </Paper>
);

const Groups = () => {
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJoinedGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/joined`, { withCredentials: true });
        setJoinedGroups(response.data.groups);
        setUserId(response.data.userId );
      } catch (error) {
        console.error("Error fetching joined groups", error);
      }
    };
    fetchJoinedGroups();
  }, []);

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/create`,
        { groupName },
        { withCredentials: true }
      );

      const newGroup = { group_id: response.data.groupId, name: groupName };
      setJoinedGroups((prevGroups) => [...prevGroups, newGroup]);
      setMessage(`Group Created! ID: ${response.data.groupId}`);
      setGroupName("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating group");
    }
  };

  const handleJoinGroup = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/join`,
        { groupId },
        { withCredentials: true }
      );
      const joinedGroup = { group_id: groupId, name: response.data.groupName };
      setJoinedGroups((prevGroups) => [...prevGroups, joinedGroup]);
      setMessage(response.data.message);
      setGroupId("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error joining group");
    }
  };

  const handleDeleteGroup = async (group_id) => {
    try {
      await axios.patch(`${API_BASE_URL}/delete/${group_id}`, {}, { withCredentials: true });

      // Remove the deleted group from the state
      setJoinedGroups((prevGroups) => prevGroups.filter(group => group.group_id !== group_id));

      setMessage("Group deleted successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting group");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, textAlign: "center" }}>Groups</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minHeight: "80vh", paddingBottom: 3 }}>
        <Box sx={{ display: "flex", gap: 3, width: "100%", maxWidth: "800px", justifyContent: "space-between" }}>
          <CardContainer title="Create Group">
            <TextField
              label="Group Name"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <Button variant="contained" onClick={handleCreateGroup} disabled={!groupName.trim()}>
              Create Group
            </Button>
          </CardContainer>
          <CardContainer title="Join Group">
            <TextField
              label="Group ID"
              fullWidth
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            />
            <Button variant="contained" color="secondary" onClick={handleJoinGroup} disabled={!groupId.trim()}>
              Join Group
            </Button>
          </CardContainer>
        </Box>
        <CardContainer title="Joined Groups" fullWidth>
  {joinedGroups.length > 0 ? (
    joinedGroups.map((group) => (
      <Paper
        key={group.group_id}
        elevation={3}
        sx={{
          padding: 2,
          marginBottom: 2,
          cursor: "pointer",
          background: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Ensures spacing
        }}
        onClick={() => navigate(`/groups/${group.group_id}`)}
      >
        <Typography variant="h6">{group.name}</Typography>
        {userId !== null && userId === group.created_by && (
          <IconButton
            edge="end"
            color="error"
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation when clicking delete
              handleDeleteGroup(group.group_id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Paper>
    ))
  ) : (
    <Typography variant="body1">You have not joined any groups yet.</Typography>
  )}
</CardContainer>

      </Box>
    </motion.div>
  );
};

export default Groups;

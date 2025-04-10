import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
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
      maxWidth: "800px",
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

const DashboardPage = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [stats, setStats] = useState({ totalSpending: 0, totalLoans: 0, totalDebts: 0 });
  const [overallStats, setOverallStats] = useState({ totalLoans: 0, totalDebts: 0 });

  // Fetch groups the user is part of
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/groups/get_groups`, { withCredentials: true });
    
        if (Array.isArray(response.data)) {
          setGroups(response.data);
          if (response.data.length > 0) {
            setSelectedGroup(response.data[0].group_id);
          }
        } else {
          console.error("Unexpected API response format:", response.data);
          setGroups([]); // Ensure it's an empty array if response is invalid
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, []);

  // Fetch financial stats when the selected group changes
  useEffect(() => {
    if (!selectedGroup) return;

    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/groups/${selectedGroup}/stats`, { withCredentials: true });

        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [selectedGroup]);


  useEffect(() => {
    const fetchOverallStats = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/groups/overall_stats`, { withCredentials: true });

            // Check if response has valid data
            if (response.data && response.data.totalLoans !== undefined && response.data.totalDebts !== undefined) {
                setOverallStats(response.data);
            } else {
                console.error("Unexpected response format:", response.data);
                setOverallStats({ totalLoans: 0, totalDebts: 0 }); // Fallback to zero values
            }
        } catch (error) {
            console.error("Error fetching overall stats:", error);
            setOverallStats({ totalLoans: 0, totalDebts: 0 }); // Fallback in case of error
        }
    };

    fetchOverallStats();
}, []);


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, textAlign: "center" }}>
        Dashboard
      </Typography>

      {/* Group Selection */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
  <FormControl
    variant="outlined"
    sx={{
      minWidth: 250,
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      borderRadius: 3,
      backdropFilter: "blur(8px)",
      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
    }}
  >
    <InputLabel
      sx={{
        color: "white",
        fontWeight: "bold",
        '&.Mui-focused': {
          color: "#ffffff",
        },
      }}
    >
      Select Group
    </InputLabel>
    <Select
      value={selectedGroup}
      onChange={(e) => setSelectedGroup(e.target.value)}
      label="Select Group"
      sx={{
        borderRadius: 3,
        color: "white",
        "& .MuiOutlinedInput-notchedOutline": {
          border: "1px solid rgba(255, 255, 255, 0.3)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255, 255, 255, 0.6)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255, 255, 255, 0.5)",
        },
        backgroundColor: "transparent",
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: "#2a2a2a",
            color: "white",
          },
        },
      }}
    >
      {groups.map((group) => (
        <MenuItem key={group.group_id} value={group.group_id}>
          {group.group_name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: "100%" }}>
        <CardContainer title="Balance Summary">
          <Typography variant="h6">Total Spending: ${stats.totalSpending}</Typography>
          <Typography variant="body1" >
            Total Loans: ${stats.totalLoans}    Total Debts: ${stats.totalDebts}
          </Typography>
        </CardContainer>


        <CardContainer title="Overall Loan & Debt Summary">
  {overallStats.totalLoans === 0 && overallStats.totalDebts === 0 ? (
    <Typography variant="h6">Loading overall stats...</Typography>
  ) : (
    <>
      <Typography variant="h6">Total Loans: ${overallStats.totalLoans}</Typography>
      <Typography variant="h6">Total Debts: ${overallStats.totalDebts}</Typography>
    </>
  )}
</CardContainer>



      </Box>

  
    </motion.div>
     
  );
};

export default DashboardPage;

import React from "react";
import { AppBar, Tabs, Tab, Toolbar, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Outlet, useNavigate, useLocation ,useParams} from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL;

const GroupLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { group_id } = useParams();
  const tabRoutes = [
    `/groups/${group_id}`, // Default to Group Details Page
    `/groups/${group_id}/debts`,
    `/groups/${group_id}/loans`
  ];
  const currentTabIndex = tabRoutes.indexOf(location.pathname);

  const handleTabChange = (event, newIndex) => {
    navigate(tabRoutes[newIndex]);
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, rgb(106, 13, 173), #9c27b0)", color: "white" }}>
      <AppBar position="fixed" sx={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)", display: "flex", flexDirection: "row", alignItems: "center" }}>
        {/* Back Button */}
        <IconButton 
          edge="start" 
          color="inherit" 
          onClick={() => navigate("/dashboard/groups")} // You can change this later
          sx={{ ml: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Tabs */}
        <Tabs value={currentTabIndex} onChange={handleTabChange} variant="fullWidth" textColor="inherit" sx={{ flexGrow: 1 }}>
          <Tab label="Add Transaction" />
          <Tab label="Debts" />
          <Tab label="Loans" />
        </Tabs>
      </AppBar>
      
      <Toolbar />
      <Outlet /> {/* This is where the selected page will render */}
    </Box>
  );
};

export default GroupLayout;

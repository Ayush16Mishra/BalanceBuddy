import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { 
  AppBar, Toolbar, Drawer, List, ListItem, ListItemText, CssBaseline, 
  Box, IconButton, ListItemIcon, Badge, Menu, MenuItem
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person"; 
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import axios from "axios";
import DashboardPage from "./DashboardPage";
import Groups from "./Groups";
import ChartSelector from "./BudgetGraph";
import Profile from "./Profile";
const API_BASE = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Groups", icon: <GroupIcon />, path: "/dashboard/groups" },
  { text: "Finance", icon: <AccountBalanceIcon />, path: "/dashboard/finance" },
  { text: "Profile", icon: <PersonIcon />, path: "/dashboard/profile" }
];

const Sidebar = ({ open }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: open ? drawerWidth : 56,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: open ? drawerWidth : 56,
        boxSizing: "border-box",
        overflowX: "hidden",
        transition: "width 0.3s ease",
        background: "linear-gradient(135deg, #6a0dad, #9c27b0)",
        color: "white"
      }
    }}
  >
    <Toolbar />
    <List>
      {menuItems.map(({ text, icon, path }) => (
        <ListItem 
          component={Link} 
          to={path} 
          key={text} 
          sx={{ display: "flex", alignItems: "center", color: "white", cursor: "pointer" }}
        >
          <ListItemIcon sx={{ minWidth: 40, justifyContent: "flex-start", color: "white" }}>
            {icon}
          </ListItemIcon>
          <Box sx={{ display: open ? "block" : "none", transition: "opacity 0.3s ease" }}>
            <ListItemText primary={text} />
          </Box>
        </ListItem>
      ))}
    </List>
  </Drawer>
);

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/groups/notifications`, { withCredentials: true });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleDrawer = () => setOpen(!open);
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleNotificationClick = (groupId) => {
    navigate(`/groups/${groupId}/loans`);
    handleCloseMenu();
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,rgb(106, 13, 173), #9c27b0)", color: "white" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: "rgba(106, 13, 173, 1)" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* Left Side: Logo and Menu Icon */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ marginRight: 2 }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ height: 40, display: "flex", alignItems: "center" }}>
              <img 
                src="/lg.svg" // Change this to your actual logo path
                alt="Logo"
                style={{ height: "100%", maxWidth: "120px", objectFit: "contain" }}
              />
            </Box>
          </Box>

          {/* Right Side: Notification Button */}
          <IconButton color="inherit" onClick={handleOpenMenu}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Notification Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            sx={{
              "& .MuiPaper-root": {
                background: "rgba(0, 0, 0, 0.3)", // ⚡ Almost transparent black
                backdropFilter: "blur(15px)", // ✨ Stronger glass effect
                borderRadius: "12px",
                boxShadow: "0px 4px 15px rgba(0,0,0,0.3)", // Softer shadow
                border: "1px solid rgba(255,255,255,0.2)", // Light border for clarity
              }
            }}
          >
            {notifications.length === 0 ? (
              <MenuItem disabled sx={{ color: "white", opacity: 0.7 }}>
                No new notifications
              </MenuItem>
            ) : (
              notifications.map((notif) => (
                <MenuItem
                  key={notif.debt_id}
                  onClick={() => handleNotificationClick(notif.group_id)}
                  sx={{
                    color: "white",
                    padding: "12px",
                    "&:hover": { background: "rgba(255,255,255,0.1)" }, // Lighter highlight
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {`Resolve request in ${notif.name}`}
                </MenuItem>
              ))
            )}
          </Menu>

        </Toolbar>
      </AppBar>

      <Sidebar open={open} />

      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: open ? `${drawerWidth}px` : "56px", position: "relative", zIndex: 2 }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/finance" element={<ChartSelector />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

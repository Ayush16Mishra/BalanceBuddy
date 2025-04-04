import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { deepPurple, indigo } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Welcome from "./components/WelcomePage";
import DashboardLayout from "./components/Dashboard";
import Dashboard from "./components/DashboardPage";
import Groups from "./components/Groups";
import LoansPage from "./components/LoansPage";
import DebtsPage from "./components/DebtsPage";
import GroupDetailsPage from "./components/GroupDetailsPage";
import GroupLayout from "./components/GroupLayout";
import ForgotPasswordPage from "./components/ForgotPassword";
import ResetPasswordPage from "./components/ResetPasswordPage";
import ChartSelector from "./components/BudgetGraph";
import Profile from "./components/Profile";


const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0D0D0D", // Even darker background
      paper: "#17112B", // Deep purplish dark
    },
    primary: deepPurple,
    secondary: indigo,
    text: {
      primary: "#E0E0E0", // Light text
      secondary:"#E0E0E0", // Subtle secondary text
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#17112B", // More purplish dark
          color: "#E0E0E0",
         
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)", // Deeper shadows
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1A1333", // Darker purple
          color: "#ffffff",
          
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#120D26", // Dark bar with purple tint
          color: "#ffffff",
        },
      },
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Ensures global dark mode styling */}
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />}/>
        <Route path="/resetPassword" element={<ResetPasswordPage/>}/>

       

        <Route path="/groups/:group_id" element={<GroupLayout />}>
          <Route index element={<GroupDetailsPage />} />
          <Route path="debts" element={<DebtsPage />} />
          <Route path="loans" element={<LoansPage />} />

        </Route>



        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} /> {/* Default page */}
          <Route path="groups" element={<Groups />} />
          <Route path="finance" element={<ChartSelector/>}/>
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App

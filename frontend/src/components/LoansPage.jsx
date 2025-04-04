import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, Box, Paper, Button } from "@mui/material";
import { motion } from "framer-motion";
const API_BASE = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const LoanCard = ({ loan, onResolve }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    style={{ width: "100%", position: "relative" }}
  >
    <Paper
      elevation={4}
      sx={{
        padding: 3,
        borderRadius: 2,
        minHeight: "120px",
        backdropFilter: "blur(10px)",
        background: "rgba(255, 255, 255, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        maxWidth: "350px",
        color: "white",
        position: "relative",
      }}
    >
      {loan.status === "in process" && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            width: "10px",
            height: "10px",
            backgroundColor: "blue",
            borderRadius: "50%",
          }}
        ></div>
      )}
      <Typography><strong>Borrower:</strong> {loan.borrower}</Typography>
      <Typography><strong>Amount:</strong> ${loan.amount}</Typography>
      <Typography><strong>Status:</strong> {loan.status}</Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => onResolve(loan.debt_id)}
        sx={{ mt: 1 }}
        disabled={loan.status === "unresolved"}
      >
        Resolve
      </Button>
    </Paper>
  </motion.div>
);

const LoansPage = () => {
  const { group_id } = useParams();
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/loans/${group_id}`, { withCredentials: true });
        console.log("API Response:", response.data);
        console.log("User ID:", response.data.user_id);

        if (!response.data || !Array.isArray(response.data.loans)) {
          throw new Error("Invalid response format");
        }

        setLoans(response.data.loans.filter(loan => 
          Number(loan.lender_id) === Number(response.data.user_id) && loan.status !== "resolved"
        )); 
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };

    fetchLoans();
  }, [group_id]);

  const handleResolve = async (debt_id) => {
    try {
      await axios.put(`${API_BASE}/api/loans/resolve/${debt_id}`, {}, { withCredentials: true });
      setLoans(prevLoans => prevLoans.filter(loan => loan.debt_id !== debt_id));
    } catch (error) {
      console.error("Error resolving loan:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", padding: "2rem 1rem", background: "linear-gradient(135deg, rgb(106, 13, 173), #9c27b0)", color: "white" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, textAlign: "center" }}>
        Loans Overview
      </Typography>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem",
          width: "100%",
          maxWidth: "1200px",
          padding: "1rem"
        }}
      >
        {loans.length > 0 ? (
          loans.map((loan, index) => (
            <LoanCard key={index} loan={loan} onResolve={handleResolve} />
          ))
        ) : (
          <Typography>No loans found for this group.</Typography>
        )}
      </motion.div>
    </Box>
  );
};

export default LoansPage;
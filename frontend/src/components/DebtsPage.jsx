import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, Box, Paper, Button } from "@mui/material";
import { motion } from "framer-motion";

const DebtCard = ({ debt, onPay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    style={{ width: "100%" }}
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
      }}
    >
      <Typography><strong>Lender:</strong> {debt.lender}</Typography>
      <Typography><strong>Amount:</strong> ${debt.amount}</Typography>
      <Typography><strong>Status:</strong> {debt.status}</Typography>

      {debt.status === "unresolved" && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => onPay(debt.debt_id, "in process")}
          sx={{ mt: 1 }}
        >
          Mark as Paid
        </Button>
      )}

      {debt.status === "in process" && (
        <Button variant="contained" color="secondary" disabled sx={{ mt: 1 }}>
          In Process
        </Button>
      )}
    </Paper>
  </motion.div>
);

const DebtsPage = () => {
  const { group_id } = useParams();
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/debts/${group_id}`, { withCredentials: true });
        console.log("API Response:", response.data);

        if (!response.data || !Array.isArray(response.data.debts)) {
          throw new Error("Invalid response format");
        }

        setDebts(response.data.debts);
      } catch (error) {
        console.error("Error fetching debts:", error);
      }
    };

    fetchDebts();
  }, [group_id]);

  const handlePay = async (debt_id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/debts/pay/${debt_id}`, 
        { status: newStatus },  
        { withCredentials: true }
      );

      setDebts(debts.map(debt =>
        debt.debt_id === debt_id ? { ...debt, status: newStatus } : debt
      ));
    } catch (error) {
      console.error("Error updating debt status:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", padding: "2rem 1rem", background: "linear-gradient(135deg, rgb(106, 13, 173), #9c27b0)", color: "white" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, textAlign: "center" }}>
        Debts Overview
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
        {debts.length > 0 ? (
          debts
            .filter(debt => debt.status !== "resolved") // Hide resolved debts
            .map((debt, index) => (
              <DebtCard key={index} debt={debt} onPay={handlePay} />
            ))
        ) : (
          <Typography>No debts found for this group.</Typography>
        )}
      </motion.div>
    </Box>
  );
};

export default DebtsPage;

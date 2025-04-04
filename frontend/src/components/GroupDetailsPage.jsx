//GroupDetailsPage.jsx

import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel,Switch,Chip  } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const tagColors = {
  accommodation: "#FF5733",
  dining: "#33FF57",
  transportation: "#3357FF",
  shopping: "#FF33A1",
  entertainment: "#FFC300",
  miscellaneous: "#A133FF"
};

const tagOptions = Object.keys(tagColors);


const GroupDetailsPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState({});
  const [members,setMembers]= useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [budget,setBudget]=useState("");
  const [setBudgetToggle, setSetBudgetToggle] = useState(false);
  const [tag, setTag] = useState("");
  const [sponsors, setSponsors] = useState([]);
  const { group_id } = useParams();

  const handleAddTransaction = async () => {
    if (!reason.trim() || !amount.trim() || !tag.trim()) return;
    
    try {
      const response = await axios.post(
        `${API_BASE}/api/transactions/add`,
        {
          group_id,
          amount: parseFloat(amount),
          reason,
          tag,
          sponsors,
        },
        { withCredentials: true }
      );

      console.log("Transaction added:", response.data);
      setReason("");
      setAmount("");
      setTag("");

      // Fetch transactions again after adding one
      fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const fetchGroupMembers = async () =>{
    try{
      const response = await axios.get(
      `${API_BASE}/api/transactions/${group_id}/members`,
        {withCredentials : true}
      );
      console.log("Group members :",response.data);
      setMembers(response.data);
    }catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  useEffect(() => {
    fetchGroupMembers();
  }, [group_id]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/transactions/${group_id}`,
        { withCredentials: true }
      );

      console.log("Fetched transactions:", response.data);
      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid response format");
      }
  
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [group_id]);


  const fetchGroupBudget = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/groups/${group_id}/budget`,
        { withCredentials: true }
      );
      setBudget(response.data.budget);
    } catch (error) {
      console.error("Error fetching budget:", error);
    }
  };

  const updateBudget = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/groups/${group_id}/budget`,
        { budget: parseFloat(budget) },
        { withCredentials: true }
      );
      alert("Budget updated successfully!");
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };
  useEffect(() => {
    fetchGroupBudget();
  }, [group_id]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        background: "linear-gradient(135deg, rgb(106, 13, 173), #9c27b0)",
        color: "white",
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 3, mb: 3, textAlign: "center", width: "100%" }}>
        Group Details
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Group ID: {group_id}
      </Typography>

      {/* Budget Section */}
      <Paper sx={{
        padding: 3,
        borderRadius: 2,
        background: "rgba(255, 255, 255, 0.15)",
        width: "100%",
        maxWidth: "600px",
        mb: 3,
      }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Budget</Typography>
        <FormControlLabel 
          control={<Switch checked={setBudgetToggle} onChange={(e) => setSetBudgetToggle(e.target.checked)} />} 
          label="Would you like to set a budget?"
        />
        {setBudgetToggle && (
          <>
            <TextField
              label="Set Budget"
              type="number"
              fullWidth
              variant="filled"
              InputProps={{ sx: { color: "white" } }}
              InputLabelProps={{ sx: { color: "white" } }}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={updateBudget} disabled={!budget.trim()}>
              Update Budget
            </Button>
          </>
        )}
      </Paper>
      {/* Add Transaction Section */}
      <Paper
        elevation={4}
        sx={{
          padding: 3,
          borderRadius: 2,
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          color: "white",
          width: "100%",
          maxWidth: "600px",
          mb: 3,
        }}
      >
        
      
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Add Transaction</Typography>
        <TextField
          label="Reason"
          fullWidth
          variant="filled"
          InputProps={{ sx: { color: "white" } }}
          InputLabelProps={{ sx: { color: "white" } }}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Amount"
          type="number"
          fullWidth
          variant="filled"
          InputProps={{ sx: { color: "white" } }}
          InputLabelProps={{ sx: { color: "white" } }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 2 }}
        />
         
<Typography variant="h6" sx={{ mb: 1 }}>Select Tag</Typography>
<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
  {tagOptions.map((option) => (
    <Chip
      key={option}
      label={option}
      onClick={() => setTag(option)}
      sx={{
        background: tag === option 
          ? `linear-gradient(135deg, ${tagColors[option]}, ${tagColors[option]}AA)`
          : "rgba(255,255,255,0.2)",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "20px",
        boxShadow: tag === option ? "0 4px 10px rgba(0,0,0,0.3)" : "none",
        "&:hover": {
          background: `linear-gradient(135deg, ${tagColors[option]}, ${tagColors[option]}88)`,
          transform: "scale(1.05)",
          transition: "0.2s ease-in-out",
        },
      }}
    />
  ))}
</Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <Button variant="outlined" onClick={() => setDialogOpen(true)} sx={{ color: "white", borderColor: "white" }}>
                  Select Sponsors
          </Button>
        </Box>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Select Sponsors</DialogTitle>
                <DialogContent>
                  {members.map((member) => (
                    <FormControlLabel
                      key={member.id}
                      control={
                        <Checkbox
                          checked={sponsors.includes(member.username)}
                          onChange={(e) => {
                            setSponsors((prev) =>
                              e.target.checked ? [...new Set([...prev, member.username])] : prev.filter((s) => s !== member.username)
                            );
                          }}
                        />
                      }
                      label={member.username}
                    />
                  ))}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
                </DialogActions>
          </Dialog>

        <Button variant="contained" color="primary" onClick={handleAddTransaction} disabled={!reason.trim() || !amount.trim() || !tag.trim()}>
          Add Transaction
        </Button>
      </Paper>

      {/* Display Transactions Grouped by Date */}
      <Box sx={{ width: "100%", maxWidth: "800px" }}>
        {Object.entries(transactions).map(([date, transactionList]) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: "2rem" }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            {new Date(date).toLocaleDateString("en-GB")}
            </Typography>
            <Paper
              elevation={4}
              sx={{
                padding: 2,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                color: "white",
              }}
            >
               {transactionList.map((transaction) => (
                <Box key={transaction.transaction_id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography>
                    <strong>{transaction.username || "User"}:</strong> {transaction.reason} - ${transaction.amount}
                  </Typography>
                                  {transaction.tag && (
                  <Chip
                    label={transaction.tag}
                    sx={{
                      background: `linear-gradient(135deg, ${tagColors[transaction.tag] || "#777"}, ${tagColors[transaction.tag] || "#999"}AA)`,
                      color: "white",
                      fontWeight: "bold",
                      padding: "6px",
                      borderRadius: "20px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      "&:hover": {
                        background: `linear-gradient(135deg, ${tagColors[transaction.tag] || "#777"}, ${tagColors[transaction.tag] || "#999"}88)`,
                        transform: "scale(1.05)",
                        transition: "0.2s ease-in-out",
                      },
                    }}
                  />
                )}
                

                </Box>
              ))}
            </Paper>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default GroupDetailsPage;

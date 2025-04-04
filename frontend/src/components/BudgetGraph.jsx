import React, { useEffect, useState } from "react";
import {PieChart, Pie,Cell,  BarChart,Bar,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import { Button, ButtonGroup, Card, CardContent, Typography, Box, Paper } from "@mui/material";
const API_BASE = import.meta.env.VITE_API_URL;

const glassyStyle = {
  background: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
};
 
const CATEGORY_COLORS = {
  accommodation: "#FF5733",
  dining: "#33FF57",
  transportation: "#3357FF",
  shopping: "#FF33A1",
  entertainment: "#FFC300",
  miscellaneous: "#A133FF"
};
function SpendingVsTripsChart() {
  const [tripData, setTripData] = useState([]);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/charts/trips`, { withCredentials: true });
        if (Array.isArray(response.data)) {
          setTripData(response.data.map((trip, index) => ({
            name: trip.name || `Trip ${index + 1}`,
            spending: trip.spending,
          })));
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };
    fetchTrips();
  }, []);

 

  return (
    <Paper elevation={6} sx={glassyStyle}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={tripData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
          <XAxis dataKey="name" tick={{ fill: "#333" }} />
          <YAxis tick={{ fill: "#333" }} />
          <Tooltip wrapperStyle={{ backdropFilter: "blur(5px)" }} />
          <Legend />
          <Line type="monotone" dataKey="spending" stroke="#4caf50" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

function SpendingVsBudgetChart() {
  const [tripData, setTripData] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/charts/trips`, { withCredentials: true });
        if (Array.isArray(response.data)) {
          setTripData(response.data.map((trip, index) => ({
            name: trip.name || `Trip ${index + 1}`,
            spending: trip.spending,
            budget: trip.budget,
          })));
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };
    fetchTrips();
  }, []);

  return (
    <Paper elevation={6} sx={glassyStyle}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={tripData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
          <XAxis dataKey="name" tick={{ fill: "#333" }} />
          <YAxis tick={{ fill: "#333" }} />
          <Tooltip wrapperStyle={{ backdropFilter: "blur(5px)" }} />
          <Legend />
          <Line type="monotone" dataKey="spending" stroke="#4caf50" strokeWidth={2} />
          <Line type="monotone" dataKey="budget" stroke="#ff5722" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
function SpendingByCategoryChart() {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("pie");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/charts/spending-by-category`, {
          withCredentials: true,
        });
        if (Array.isArray(response.data)) {
          setData(
            response.data.map((item) => ({
              name: item.tag || "Unknown",
              value: parseFloat(item.total_spent),
              color: CATEGORY_COLORS[item.tag] || "#8884d8",
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching spending by category:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 3, textAlign: "center" }}>
      <Paper elevation={6} sx={glassyStyle}>
        <Typography variant="h6" gutterBottom>
          Spending by Category
        </Typography>
        <ButtonGroup variant="contained" sx={{ mb: 2 }}>
          <Button onClick={() => setChartType("pie")} sx={{ backgroundColor: "#4caf50", color: "white" }}>
            Pie Chart
          </Button>
          <Button onClick={() => setChartType("bar")} sx={{ backgroundColor: "#416bf2", color: "white" }}>
            Bar Chart
          </Button>
        </ButtonGroup>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "pie" ? (
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
              <XAxis dataKey="name" tick={{ fill: "#333" }} />
              <YAxis tick={{ fill: "#333" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}

export default function ChartSelector() {
  const [selectedChart, setSelectedChart] = useState("spending");

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 3, textAlign: "center" }}>
      <Paper elevation={6} sx={{ ...glassyStyle, padding: "15px", marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Select Chart Type
        </Typography>
        <ButtonGroup variant="contained">
          <Button onClick={() => setSelectedChart("spending")} sx={{ backgroundColor: "#4caf50", color: "white" }}>
            Spending vs Trips
          </Button>
          <Button onClick={() => setSelectedChart("budget")} sx={{ backgroundColor: "#416bf2", color: "white" }}>
            Spending vs Budget
          </Button>
        
        </ButtonGroup>
      </Paper>
      {selectedChart === "spending" ?
        <SpendingVsTripsChart /> :
        <SpendingVsBudgetChart />
      }
        <SpendingByCategoryChart />
      
      
    </Box>
  );
}

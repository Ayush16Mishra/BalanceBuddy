import React, { useEffect, useState,useRef } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import axios from "axios";
import {
  Button, ButtonGroup, Card, CardContent, Typography, Box, Paper, Grid, Divider
} from "@mui/material";
import { toPng } from "html-to-image";

const API_BASE = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

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
  miscellaneous: "#A133FF",
};

const downloadChartAsPng = async (ref, filename = "chart.png") => {
  if (ref.current === null) return;

  try {
    const dataUrl = await toPng(ref.current);
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Error exporting chart as PNG:", err);
  }
};


function SpendingVsTripsChart() {
  const [tripData, setTripData] = useState([]);
  const chartRef = useRef(null);


  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/charts/trips`);
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
    <Paper  elevation={6} sx={glassyStyle}>
      <div ref={chartRef}>
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
    </div>
    <Button
    variant="outlined"
    size="small"
    onClick={() => downloadChartAsPng(chartRef, "spending-vs-trips.png")}
    sx={{ mt: 1 }}
  >
    Export as PNG
  </Button>
   </Paper>
  );
}

function SpendingVsBudgetChart() {
  const [tripData, setTripData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/charts/trips`);
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
      <div ref={chartRef}>
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
     </div>
     <Button
     variant="outlined"
     size="small"
     onClick={() => downloadChartAsPng(chartRef, "spending-vs-budget.png")}
     sx={{ mt: 1 }}
   >
     Export as PNG
   </Button>
    </Paper>
  );
}

function SpendingByCategoryChart() {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("pie");
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/charts/spending-by-category`);
        if (Array.isArray(response.data)) {
          setData(response.data.map(item => ({
            name: item.tag || "Unknown",
            value: parseFloat(item.total_spent),
            color: CATEGORY_COLORS[item.tag] || "#8884d8",
          })));
        }
      } catch (err) {
        console.error("Error fetching spending by category:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
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
      <Paper  elevation={6} sx={glassyStyle}>
      <div style={{ width: "600px", height: "300px", margin: "0 auto" }} ref={chartRef}>
      <ResponsiveContainer width="100%" height={300}>
        {chartType === "pie" ? (
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
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
      </div>
      <Button
     variant="outlined"
     size="small"
     onClick={() => downloadChartAsPng(chartRef, "spending-vs-tags.png")}
     sx={{ mt: 1 }}
   >
     Export as PNG
   </Button>
    </Paper>
    </Box>
  );
}

export default function ChartSelector() {
  const [selectedChart, setSelectedChart] = useState("spending");

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", mt: 4 }}>
      <Paper elevation={6} sx={{ ...glassyStyle, mb: 4 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          Select Chart Type
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <ButtonGroup variant="contained">
            <Button onClick={() => setSelectedChart("spending")} sx={{ backgroundColor: "#4caf50", color: "white" }}>
              Spending vs Trips
            </Button>
            <Button onClick={() => setSelectedChart("budget")} sx={{ backgroundColor: "#416bf2", color: "white" }}>
              Spending vs Budget
            </Button>
          </ButtonGroup>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {selectedChart === "spending" ? <SpendingVsTripsChart /> : <SpendingVsBudgetChart />}
      </Paper>

      <Paper elevation={6} sx={glassyStyle}>
        <SpendingByCategoryChart />
      </Paper>
    </Box>
  );
}

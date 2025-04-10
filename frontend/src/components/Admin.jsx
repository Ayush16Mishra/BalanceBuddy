import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  Grid,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TableSortLabel,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { saveAs } from "file-saver";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [view, setView] = useState("");
  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deletingGroupId, setDeletingGroupId] = useState(null);

  const outputRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const scrollToOutput = () => {
    if (outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleGroupDelete = async (groupId) => {
    const confirm = window.confirm("Are you sure you want to delete this group?");
    if (!confirm) return;
    setDeletingGroupId(groupId);
  
    try {
      await axios.patch(`${apiUrl}/api/admin/groups/${groupId}/delete`, {}, { withCredentials: true });
      alert("Group deleted successfully.");
      fetchData("groups");
      setPage(0);
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete group.");
    } finally {
      setDeletingGroupId(null);
    }
  };
  
  const fetchData = async (type) => {
    setView(type);
    let url = `${apiUrl}/api/admin/${type}`;

    if (type === "transactions/user-group" && userId && groupId)
      url += `?userId=${userId}&groupId=${groupId}`;
    else if (type === "transactions/user" && userId) url += `/${userId}`;
    else if (type === "debts/user" && userId) url += `/${userId}`;
    else if (type === "transactions/group" && groupId) url += `/${groupId}`;
    else if (type === "debts/group" && groupId) url += `/${groupId}`;

    try {
      const res = await axios.get(url, { withCredentials: true });
      setData(res.data);
      setPage(0);
      setTimeout(scrollToOutput, 5);
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setData([]);
      setPage(0);
    }
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(column);
  };

  const handleExport = () => {
    const headers = Object.keys(data[0]);
    const rows = data.map((row) => headers.map((key) => `"${row[key]}"`).join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${view.replace("/", "_") || "data"}.csv`);
  };

  const filteredData = data
    .filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * (sortOrder === "asc" ? 1 : -1);
    });

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, bgcolor: "#0d1b2a", minHeight: "100vh", color: "#e0e0e0" }}>
  <Typography variant="h4" gutterBottom fontWeight={600} color="#e0e0e0">
    Admin Dashboard
  </Typography>

  <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: "#1b263b" }}>
    <Typography variant="h6" gutterBottom color="#e0e0e0">
      Quick Actions
    </Typography>
    <Stack direction="row" spacing={2} flexWrap="wrap">
      <Button variant="contained" sx={{ bgcolor: "#0d47a1" }} onClick={() => fetchData("users")}>
        All Users
      </Button>
      <Button variant="contained" sx={{ bgcolor: "#2e7d32" }} onClick={() => fetchData("groups")}>
        All Groups
      </Button>
      <Button variant="contained" sx={{ bgcolor: "#6a1b9a" }} onClick={() => fetchData("transactions")}>
        All Transactions
      </Button>
      <Button variant="contained" sx={{ bgcolor: "#ef6c00" }} onClick={() => fetchData("debts")}>
        All Debts
      </Button>
    </Stack>
  </Paper>

  <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: "#1b263b" }}>
  <Typography variant="h6" gutterBottom color="#1565c0">
    Filtered Queries
  </Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <TextField
        label="User ID"
        fullWidth
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Group ID"
        fullWidth
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Button
          variant="outlined"
          sx={{ color: "#0d47a1", borderColor: "#0d47a1" }}
          onClick={() => fetchData("transactions/user")}
        >
          User Transactions
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "#0d47a1", borderColor: "#0d47a1" }}
          onClick={() => fetchData("debts/user")}
        >
          User Debts
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "#0d47a1", borderColor: "#0d47a1" }}
          onClick={() => fetchData("transactions/group")}
        >
          Group Transactions
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "#0d47a1", borderColor: "#0d47a1" }}
          onClick={() => fetchData("debts/group")}
        >
          Group Debts
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "#0d47a1", borderColor: "#0d47a1" }}
          onClick={() => fetchData("transactions/user-group")}
        >
          User-Group Transactions
        </Button>
      </Stack>
    </Grid>
  </Grid>
</Paper>

  <Paper elevation={2} sx={{ p: 2, bgcolor: "#1b263b" }} ref={outputRef}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h6" color="#e0e0e0">
        {view ? view.replace("/", " ").toUpperCase() : "Output"}
      </Typography>
      {data.length > 0 && (
        <Button variant="outlined" size="small" sx={{ color: "#e0e0e0", borderColor: "#e0e0e0" }} onClick={handleExport}>
          Export CSV
        </Button>
      )}
    </Stack>

    <Divider sx={{ my: 2, borderColor: "#e0e0e0" }} />

    {data.length > 0 && (
      <>
        <TextField
          placeholder="Search..."
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 2,
            input: { color: "#e0e0e0" },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#415a77",
              "& fieldset": { borderColor: "#e0e0e0" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#e0e0e0" }} />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
          <TableHead sx={{ bgcolor: "#2e3b55" }}>
  <TableRow>
    {Object.keys(data[0]).map((key) => (
      <TableCell key={key} sx={{ color: "#e0e0e0", fontWeight: 600 }}>
        <TableSortLabel
          active={sortBy === key}
          direction={sortBy === key ? sortOrder : "asc"}
          onClick={() => handleSort(key)}
          sx={{ color: "#e0e0e0", "&.Mui-active": { color: "#e0e0e0" } }}
        >
          {key}
        </TableSortLabel>
      </TableCell>
    ))}
    {view === "groups" && (
      <TableCell sx={{ color: "#e0e0e0", fontWeight: 600 }}>Actions</TableCell>
    )}
  </TableRow>
</TableHead>

            <TableBody>
  {paginatedData.map((row, idx) => (
    <TableRow key={idx}>
      {Object.entries(row).map(([key, val]) => (
        <TableCell key={key} sx={{ color: "#e0e0e0" }}>
          {typeof val === "object" ? JSON.stringify(val) : String(val)}
        </TableCell>
      ))}

      {/* Add delete button only for groups */}
      {view === "groups" && (
        <TableCell>
          <Button
  variant="outlined"
  color="error"
  size="small"
  disabled={row.is_deleted} 
  onClick={() => handleGroupDelete(row.group_id)}
  
>
  {deletingGroupId === row.group_id ? "Deleting..." : "Delete"}
</Button>

        </TableCell>
      )}
    </TableRow>
  ))}
</TableBody>

          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            color: "#e0e0e0",
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              color: "#e0e0e0",
            },
            ".MuiInputBase-root": {
              color: "#e0e0e0",
            },
            ".MuiSvgIcon-root": {
              color: "#e0e0e0",
            },
          }}
        />
      </>
    )}

    {data.length === 0 && (
      <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
        No data to display.
      </Typography>
    )}
  </Paper>
</Box>

  );
};

export default AdminDashboard;

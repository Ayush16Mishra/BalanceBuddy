const express = require("express");
const cookieSession = require("cookie-session"); // Use cookie-session, not express-session
const { Pool } = require("pg");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
app.set('trust proxy', 1);


const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Connection error", err.stack));

// Use cookie-session for session management
app.use(
  cookieSession({
    name: "session",               // Cookie name
    keys: [process.env.SESSION_SECRET || "secret_key"], // Secret keys for cookie encryption
    maxAge: 24 * 60 * 60 * 1000,    // 1 day (cookie expiry)
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production (require HTTPS)
    httpOnly: true,                 // Ensure the cookie is HTTP-only
    sameSite:  process.env.NODE_ENV === "production" ? "none" : "lax",               // Allow cross-origin cookies
  })
);
app.use((req, res, next) => {
  if (req.session && typeof req.session.regenerate !== "function") {
    req.session.regenerate = (cb) => cb();
  }
  if (req.session && typeof req.session.destroy !== "function") {
    req.session.destroy = (cb) => {
      req.session = null;
      cb();
    };
  }
  if (req.session && typeof req.session.save !== "function") {
    req.session.save = (cb) => cb(); // ← THIS fixes the new error
  }
  next();
});
const passport = require("./config/passport")(pool);
app.use(passport.initialize());
app.use(passport.session());



// CORS configuration
const allowedOrigins = [
  "https://balance-buddy-ruddy.vercel.app",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Route handlers
const authRoutes = require("./routes/auth")(passport, pool);
const groupRoutes = require("./routes/groups")(pool);
const transactionRoutes = require("./routes/transactions")(pool);
const loansRoutes = require("./routes/loans")(pool);
const debtsRoutes = require("./routes/debts")(pool);
const chartRoutes = require("./routes/charts")(pool);

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/loans", loansRoutes);
app.use("/api/debts", debtsRoutes);
app.use("/api/charts", chartRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running. Navigate to /api for endpoints.');
});

// Debugging session data
app.use((req, res, next) => {
  console.log("🔍 Session Debugging:");
  console.log("Session ID:", req.sessionID);
  console.log("Session Data:", req.session);
  console.log("Authenticated User:", req.user);
  next();
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});






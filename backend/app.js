//app.js
const express= require("express");
const session= require("express-session");
const {Pool}=require("pg");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const pgSession = require("connect-pg-simple")(session);

const app=express();
const PORT=5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false }  
});


pool.connect()
          .then(()=>console.log("Connected to postgress"))
          .catch(err=>console.error("Connection errot",err.stack));

          app.use(
            session({
                store: new pgSession({
                    pool: pool,
                    tableName: "session", // Optional: specify a session table name
                }),     
                name: "connect.sid", // ✅ optional but recommended
                secret: process.env.SESSION_SECRET || "secret_key",
                resave: false,
                saveUninitialized: false,
                cookie: {
                  secure: true,        // ✅ required for HTTPS (like Vercel + Railway)
                  httpOnly: true,
                  sameSite: "none",    // ✅ required for cross-origin cookies
                  maxAge: 24 * 60 * 60 * 1000 // 1 day
                }
                   
            })
        );

        
const passport=require("./config/passport")(pool);
const authRoutes = require("./routes/auth")(passport, pool);
const groupRoutes = require("./routes/groups")(pool);
const transactionRoutes = require("./routes/transactions")(pool);
const loansRoutes=require("./routes/loans")(pool);
const debtsRoutes=require("./routes/debts")(pool);
const chartRoutes=require("./routes/charts")(pool);


app.use(passport.initialize());
app.use(passport.session());
const allowedOrigins = [
    "https://balance-buddy-ijcrz5req-ayush-mishras-projects-6e8c1469.vercel.app",
    "https://balance-buddy-ruddy.vercel.app",
    "http://localhost:3000"
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

app.get('/', (req, res) => {
    res.send('API is running. Navigate to /api for endpoints.');
});
app.use((req, res, next) => {
    console.log("🔍 Session Debugging:");
    console.log("Session ID:", req.sessionID);
    console.log("Session Data:", req.session);
    console.log("Authenticated User:", req.user);
    next();
});

app.use("/api/auth",authRoutes);
app.use("/api/groups",groupRoutes);
app.use("/api/transactions",transactionRoutes);
app.use("/api/loans",loansRoutes);
app.use("/api/debts",debtsRoutes);
app.use("/api/charts",chartRoutes);

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});

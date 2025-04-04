//app.js
const express= require("express");
const session= require("express-session");
const {Client}=require("pg");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const pgSession = require("connect-pg-simple")(session);

const app=express();
const PORT=5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new Client({
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false }  
});


client.connect()
          .then(()=>console.log("Connected to postgress"))
          .catch(err=>console.error("Connection errot",err.stack));

          app.use(
            session({
                store: new pgSession({
                    conString: process.env.DATABASE_URL,
                    tableName: "session", // Optional: specify a session table name
                }),
                secret: process.env.SESSION_SECRET || "secret_key",
                resave: false,
                saveUninitialized: false,
                cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 1-day expiration
            })
        );

        
const passport=require("./config/passport")(client);
const authRoutes = require("./routes/auth")(passport, client);
const groupRoutes = require("./routes/groups")(client);
const transactionRoutes = require("./routes/transactions")(client);
const loansRoutes=require("./routes/loans")(client);
const debtsRoutes=require("./routes/debts")(client);
const chartRoutes=require("./routes/charts")(client);


app.use(passport.initialize());
app.use(passport.session());
const allowedOrigins = [
    "https://balance-buddy-p5mmew0zl-ayush-mishras-projects-6e8c1469.vercel.app",
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

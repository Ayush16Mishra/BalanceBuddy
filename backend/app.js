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

const client= new Client({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME
});

client.connect()
          .then(()=>console.log("Connected to postgress"))
          .catch(err=>console.error("Connection errot",err.stack));

          app.use(
            session({
                store: new pgSession({
                    pool: client, // Use the existing PostgreSQL client
                    tableName: "session", // Optional: specify a session table name
                    createTableIfMissing: true, // Auto-create table if missing
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

app.use(
    cors({
        origin: "http://localhost:3000", // Allow requests only from your frontend URL
        credentials: true, // Allow cookies and authentication headers
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

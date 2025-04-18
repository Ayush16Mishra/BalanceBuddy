//auth.js

const express = require("express");
const bcrypt= require("bcryptjs");
const router= express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports=(passport,pool)=>{

    router.post('/signup',async(req,res)=>{
        const{username,email,password,confirmPassword}=req.body;
        if(!username||!email||!password||!confirmPassword){
            console.log("Incomplete fields");
            return res.status(400).json({ message: "All fields are required" });
        }

        if(password!==confirmPassword){
            console.log("Incorrect password");
            return res.status(400).json({ message: "Passwords do not match" });
        }
        try{
            const users = await pool.query("SELECT * FROM users WHERE username=$1",[username]);
            if(users.rows.length>0){
                console.log("username already exists");
                return res.status(400).json({ message: "Username already exists" });
            }
            const hashedPassword= await bcrypt.hash(password,10);
            await pool.query("INSERT INTO users(username,email,password,created_at)VALUES($1,$2,$3,NOW())",[username,email,hashedPassword]);
            res.status(201).json({ message: "Signup successful" });
        }catch(err){
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    });
    router.post("/login", (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
          if (err) return next(err);
          if (!user) return res.status(401).json({ message: "Invalid credentials" });
      
          // 👇 This is what sets the session and cookie
          req.login(user, (err) => {
            if (err) return next(err);
            console.log("✅ Logged in user:", req.user);
            return res.json({ message: "Login successful", user: req.user });
          });
        })(req, res, next);
      });

    router.get("/logout",(req,res,next)=>{
        req.logout((err)=>{
            if(err){
                return next(err);
            }
            console.log("Logged out");
            res.json({ message: "Logout successful" });
        });
    });

    router.get("/check-auth", (req, res) => {
        if (req.isAuthenticated()) {
            res.json({ isAuthenticated: true, user: req.user });
        } else {
            res.status(401).json({ isAuthenticated: false });
        }
    });
    
    router.post("/forgotPassword", async (req, res) => {
        const { email } = req.body;

        try {
            const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
            if (user.rows.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }

            // Generate reset token
            const resetToken = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            // Send email with reset link
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.rows[0].email,
                subject: "Password Reset Request",
                text: `Click the following link to reset your password: ${resetUrl}`,
            };

            await transporter.sendMail(mailOptions);
            res.json({ message: "Reset link sent to email." });
        } catch (error) {
            console.error("Forgot Password Error:", error);
            res.status(500).json({ message: "Server error." });
        }
    });

    // Reset Password Route (PostgreSQL)
    router.post("/resetPassword", async (req, res) => {
        const { token, password } = req.body;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await pool.query("SELECT * FROM users WHERE id=$1", [decoded.id]);

            if (user.rows.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query("UPDATE users SET password=$1 WHERE id=$2", [hashedPassword, decoded.id]);

            res.json({ message: "Password reset successful!" });
        } catch (error) {
            console.error("Reset Password Error:", error);
            res.status(400).json({ message: "Invalid or expired token." });
        }
    });

    router.get("/profile", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    
        try {
            const user = await pool.query("SELECT username, email, created_at FROM users WHERE user_id=$1", [req.user.user_id]);
    
            if (user.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
    
            res.json(user.rows[0]);
        } catch (error) {
            console.error("Profile Fetch Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

    router.put("/profile", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    
        const { username, email } = req.body;
    
        if (!username || !email) {
            return res.status(400).json({ message: "Username and email are required." });
        }
    
        try {
            const existingUser = await pool.query("SELECT * FROM users WHERE username=$1 AND user_id != $2", [username, req.user.user_id]);
    
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ message: "Username already taken." });
            }
    
            await pool.query("UPDATE users SET username=$1, email=$2 WHERE user_id=$3", [username, email, req.user.user_id]);
    
            const updatedUser = await pool.query("SELECT username, email, created_at FROM users WHERE user_id=$1", [req.user.user_id]);
    
            res.json(updatedUser.rows[0]);
        } catch (error) {
            console.error("Profile Update Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
    
    

    return router;
};
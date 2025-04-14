//groups.js

const express = require("express");
const router = express.Router();

module.exports = (pool) => {
    router.post("/create", async (req, res) => {
        console.log("Authenticated:", req.isAuthenticated()); // Debugging
        console.log("User:", req.user); // Debugging

        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
    
        const { groupName } = req.body;
        const userId = req.user?.user_id; // Corrected way to assign userId

        if (!groupName) {
            return res.status(400).json({ message: "Enter Group Name" });
        }

        try {
            const result = await pool.query(
                "INSERT INTO groups (name, created_by, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING group_id",
                [groupName, userId]
            );

            const groupId = result.rows[0].group_id;
            
            // Add the creator as the first member of the group
            await pool.query(
                "INSERT INTO user_groups (user_id, group_id, total_spent, total_loaned, total_owed, joined_at) VALUES ($1, $2, 0.00, 0.00, 0.00, CURRENT_TIMESTAMP)",
                [userId, groupId]
            );

            res.status(201).json({ message: "Group created successfully", groupId });
        } catch (err) {
            console.error("Error creating group:", err);
            res.status(500).json({ message: "Server error" });
        }
    });

    router.post("/join", async (req, res) => {
        console.log("Authenticated:", req.isAuthenticated()); // Debugging
        console.log("User:", req.user); // Debugging

        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const { groupId } = req.body;
        const userId = req.user?.user_id;

        if (!groupId) {
            return res.status(400).json({ message: "Group ID is required." });
        }

        try {
            // Check if the group exists
            const groupCheck = await pool.query("SELECT group_id FROM groups WHERE group_id = $1", [groupId]);
            if (groupCheck.rowCount === 0) {
                return res.status(404).json({ message: "Group not found." });
            }

            // Check if the user is already a member
            const membershipCheck = await pool.query(
                "SELECT * FROM user_groups WHERE user_id = $1 AND group_id = $2", 
                [userId, groupId]
            );
            if (membershipCheck.rowCount > 0) {
                return res.status(400).json({ message: "User is already a member of this group." });
            }

            // Add the user to the group
            await pool.query(
                "INSERT INTO user_groups (user_id, group_id, total_spent, total_loaned, total_owed, joined_at) VALUES ($1, $2, 0.00, 0.00, 0.00, CURRENT_TIMESTAMP)",
                [userId, groupId]
            );

            res.status(201).json({ message: "Successfully joined the group." });
        } catch (err) {
            console.error("Error joining group:", err);
            res.status(500).json({ message: "Server error." });
        }
    });

    router.get("/joined", async (req, res) => {
        console.log("Authenticated:", req.isAuthenticated()); // Debugging
        console.log("User:", req.user); // Debugging
    
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
    
        const userId = req.user?.user_id;
    
        try {
            const result = await pool.query(
                `SELECT g.group_id, g.name ,g.created_by
                 FROM groups g
                 INNER JOIN user_groups ug ON g.group_id = ug.group_id
                 WHERE ug.user_id = $1 AND g.is_deleted = false`,
                [userId]
            );
    
            res.status(200).json({userId, groups: result.rows });
        } catch (err) {
            console.error("Error fetching joined groups:", err);
            res.status(500).json({ message: "Server error." });
        }
    });

    router.get("/get_groups", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
    
        try {
            const result = await pool.query(
                `SELECT g.group_id, g.name AS group_name
                 FROM user_groups gm
                 JOIN groups g ON gm.group_id = g.group_id
                 WHERE gm.user_id = $1`,
                [req.user.user_id]
            );
    
            res.json(result.rows);
        } catch (err) {
            console.error("Error fetching user groups:", err);
            res.status(500).json({ message: "Server error" });
        }
    });
    
    router.get("/:group_id/stats", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
    
        const { group_id } = req.params;
        const user_id = req.user.user_id;
    
        try {
            const result = await pool.query(
                `SELECT total_spent AS "totalSpending", 
                        total_loaned AS "totalLoans", 
                        total_owed AS "totalDebts"
                 FROM user_groups 
                 WHERE user_id = $1 AND group_id = $2`,
                [user_id, group_id]
            );
    
            if (result.rowCount === 0) {
                return res.status(404).json({ message: "No data found for this user in the group." });
            }
    
            res.json(result.rows[0]);
        } catch (err) {
            console.error("Error fetching financial stats:", err);
            res.status(500).json({ message: "Server error" });
        }
    });
    router.get("/:group_id/budget", async (req, res) => {
        const { group_id } = req.params;
        const user_id = req.user.user_id; // Assuming authentication middleware
      
        try {
          const result = await pool.query(
            "SELECT budget FROM user_groups WHERE group_id = $1 AND user_id = $2",
            [group_id, user_id]
          );
          res.json({ budget: result.rows[0]?.budget || 0 });
        } catch (error) {
          res.status(500).json({ error: "Error fetching budget" });
        }
      });
      router.put("/:group_id/budget", async (req, res) => {
        const { group_id } = req.params;
        const { budget } = req.body;
        const user_id = req.user.user_id; // Assuming authentication middleware
      
        try {
          await pool.query(
            "UPDATE user_groups SET budget = $1 WHERE group_id = $2 AND user_id = $3",
            [budget, group_id, user_id]
          );
          res.json({ message: "Budget updated successfully" });
        } catch (error) {
          res.status(500).json({ error: "Error updating budget" });
        }
      });
      
      
      router.patch("/delete/:group_id", async (req, res) => {
        const { group_id } = req.params;
        const userId = req.user.user_id; // Ensure authentication middleware sets this
    
        // Check if the user is the creator
        const group = await pool.query("SELECT created_by FROM groups WHERE group_id = $1", [group_id]);
        if (group.rows.length === 0 || group.rows[0].created_by !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this group" });
        }
    
        // Soft delete
        await pool.query("UPDATE groups SET is_deleted = TRUE WHERE group_id = $1", [group_id]);
    
        res.json({ message: "Group deleted successfully" });
    });
    
// Get total loans and debts for the logged-in user
router.get("/overall_stats", async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const userId = req.user.user_id; // Assuming user_id is stored in req.user after authentication

        // Get total loans and debts for the user (excluding resolved debts)
        const statsQuery = await pool.query(
            `SELECT 
                COALESCE(SUM(CASE WHEN lender_id = $1 THEN amount ELSE 0 END), 0) AS "totalLoans",
                COALESCE(SUM(CASE WHEN borrower_id = $1 THEN amount ELSE 0 END), 0) AS "totalDebts"
            FROM debts
            WHERE (lender_id = $1 OR borrower_id = $1) 
              AND status <> 'resolved'`,  // Exclude resolved debts
            [userId]
        );

        const { totalLoans, totalDebts } = statsQuery.rows[0];

        res.json({ totalLoans, totalDebts });

    } catch (error) {
        console.error("Error fetching overall stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/notifications", async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const userId = req.user.user_id;

        // Fetch unresolved debts (group resolve requests) for groups the user is part of
        const notificationsQuery = await pool.query(
            `SELECT d.debt_id, d.group_id, g.name 
            FROM debts d
            JOIN groups g ON d.group_id = g.group_id
            WHERE d.status = 'in process' 
            AND d.lender_id = $1`, 
            [userId]
        );

        res.json(notificationsQuery.rows);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



    
    return router;
};

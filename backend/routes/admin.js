const express = require("express");
const router = express.Router();

module.exports = (pool)=>{

    router.get("/users", async (req, res) => {
        try {
          const result = await pool.query("SELECT user_id, username, email, created_at FROM users ORDER BY created_at DESC");
          res.json(result.rows);
        } catch (err) {
          console.error("Error fetching users:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });


      router.get("/groups", async (req, res) => {
        try {
          const result = await pool.query(`
            SELECT group_id, name, created_by, created_at, is_deleted
            FROM groups
            ORDER BY created_at DESC
          `);
          res.json(result.rows);
        } catch (err) {
          console.error("Error fetching groups:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });

      
      router.get("/transactions", async (req, res) => {
        try {
          const result = await pool.query(`
            SELECT transaction_id, group_id, user_id, amount, reason, tag, created_at
            FROM transactions
            ORDER BY created_at DESC
          `);
          res.json(result.rows);
        } catch (err) {
          console.error("Error fetching transactions:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });

      
      router.get("/debts", async (req, res) => {
        try {
          const result = await pool.query(`
            SELECT debt_id, transaction_id, group_id, lender_id, borrower_id, amount, status, sponsored, created_at
            FROM debts
            ORDER BY created_at DESC
          `);
          res.json(result.rows);
        } catch (err) {
          console.error("Error fetching debts:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
      
      router.patch("/groups/:group_id/delete", async (req, res) => {
        const { group_id } = req.params;
        try {
          await pool.query("UPDATE groups SET is_deleted = TRUE WHERE group_id = $1", [group_id]);
          res.json({ message: "Group marked as deleted" });
        } catch (err) {
          console.error("Error soft-deleting group:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });

      router.get("/group-users/:group_id", async (req, res) => {
        const { group_id } = req.params;
        try {
          const result = await pool.query(`
            SELECT ug.*, u.username
            FROM user_groups ug
            JOIN users u ON ug.user_id = u.user_id
            WHERE ug.group_id = $1
          `, [group_id]);
          res.json(result.rows);
        } catch (err) {
          console.error("Error fetching users for group:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });

      
      router.get("/user-groups/:user_id", async (req, res) => {
        const { user_id } = req.params;
        try {
          const result = await pool.query(`
            SELECT ug.*, g.name AS group_name
            FROM user_groups ug
            JOIN groups g ON ug.group_id = g.group_id
            WHERE ug.user_id = $1
          `, [user_id]);
          res.json(result.rows);
        } catch (err) {
          console.error("Error fetching groups for user:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });

      router.get("/transactions/user/:user_id", async (req, res) => {
        const { user_id } = req.params;
      
        try {
          const result = await pool.query(`
            SELECT t.*, g.name AS group_name
            FROM transactions t
            JOIN groups g ON t.group_id = g.group_id
            WHERE t.user_id = $1
            ORDER BY t.created_at DESC
          `, [user_id]);
      
          res.json(result.rows);
        } catch (err) {
          console.error("Error fetching transactions for user:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });

      
      router.get("/debts/user/:user_id", async (req, res) => {
        const { user_id } = req.params;
      
        try {
          const result = await pool.query(`
            SELECT d.*, g.name AS group_name
            FROM debts d
            JOIN groups g ON d.group_id = g.group_id
            WHERE d.lender_id = $1 OR d.borrower_id = $1
            ORDER BY d.created_at DESC
          `, [user_id]);
      
          res.json(result.rows);
        } catch (err) {
          console.error("Error fetching debts for user:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
      

      router.get("/transactions/group/:group_id", async (req, res) => {
        const { group_id } = req.params;
      
        try {
          const result = await pool.query(`
            SELECT t.*, u.username AS added_by
            FROM transactions t
            JOIN users u ON t.user_id = u.user_id
            WHERE t.group_id = $1
            ORDER BY t.created_at DESC
          `, [group_id]);
      
          res.json(result.rows);
        } catch (err) {
          console.error("Error fetching transactions for group:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });

      
      router.get("/debts/group/:group_id", async (req, res) => {
        const { group_id } = req.params;
      
        try {
          const result = await pool.query(`
            SELECT d.*, 
                   lender.username AS lender_name,
                   borrower.username AS borrower_name
            FROM debts d
            JOIN users lender ON d.lender_id = lender.user_id
            JOIN users borrower ON d.borrower_id = borrower.user_id
            WHERE d.group_id = $1
            ORDER BY d.created_at DESC
          `, [group_id]);
      
          res.json(result.rows);
        } catch (err) {
          console.error("Error fetching debts for group:", err);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });

      router.get("/transactions/user-group", async (req, res) => {
        const { userId, groupId } = req.query;
        const result = await pool.query(
          "SELECT * FROM transactions WHERE user_id = $1 AND group_id = $2",
          [userId, groupId]
        );
        res.json(result.rows);
      });
      

    return router;
}

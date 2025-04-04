const express = require("express");
const router = express.Router();

module.exports = (pool) => {
    // ✅ Get all debts of the logged-in user for a specific group
    router.get("/:group_id", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const { group_id } = req.params;
        const borrower_id = req.user?.user_id;

        try {
            const result = await pool.query(
                `SELECT d.*, u.username AS lender
                 FROM debts d
                 JOIN users u ON d.lender_id = u.user_id
                 WHERE d.group_id = $1 AND d.borrower_id = $2 AND d.sponsored = FALSE`,
                [group_id, borrower_id]
            );

            res.json({ group_id, debts: result.rows });
        } catch (err) {
            console.error("Error fetching debts:", err);
            res.status(500).json({ message: "Server error" });
        }
    });

    // ✅ Mark a debt as paid (change its status to "Paid")
    router.put("/pay/:debt_id", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const { debt_id } = req.params;
        const borrower_id = req.user?.user_id;
        console.log("User ID:", req.user?.user_id);
         console.log("Lender ID check:", debt_id);

        try {
            const updateResult = await pool.query(
                `UPDATE debts 
                 SET status = 'in process' 
                 WHERE debt_id = $1 AND borrower_id = $2 
                 RETURNING *`,
                [debt_id, borrower_id]
            );

            if (updateResult.rowCount === 0) {
                return res.status(404).json({ message: "Debt not found or unauthorized." });
            }

            res.json({ message: "Debt marked as paid successfully." });
        } catch (err) {
            console.error("Error updating debt status:", err);
            res.status(500).json({ message: "Server error" });
        }
    });

    return router;
};

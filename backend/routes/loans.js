const express = require("express");
const router = express.Router();

module.exports = (pool) => {
    // ✅ Get all loans provided by the logged-in user for a specific group
    router.get("/:group_id", async (req, res) => {
        console.log("Authenticated User in Loans Route:", req.user);
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const { group_id } = req.params;
        const lender_id = req.user?.user_id;

       
        try {
            const result = await pool.query(
                `SELECT d.*, u.username AS borrower
                 FROM debts d
                 JOIN users u ON d.borrower_id = u.user_id
                 WHERE d.group_id = $1 AND d.sponsored = FALSE `, 
                [group_id]
            );
            res.json({ group_id, user_id: lender_id, loans: result.rows });
             // ✅ Return grouped data
        } catch (err) {
            console.error("Error fetching loans:", err);
            res.status(500).json({ message: "Server error" });
        }
    });

    // ✅ Resolve a loan (change its status to "Resolved")
    router.put("/resolve/:debt_id", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
    
        const { debt_id } = req.params;
        const lender_id = req.user?.user_id;
    
        try {
            await pool.query("BEGIN"); // Start transaction
    
            // ✅ Get debt details before updating
            const debtResult = await pool.query(
                `SELECT borrower_id, group_id, amount 
                 FROM debts 
                 WHERE debt_id = $1 AND lender_id = $2 AND status = 'in process'`,
                [debt_id, lender_id]
            );
    
            if (debtResult.rowCount === 0) {
                return res.status(404).json({ message: "Loan not found or unauthorized." });
            }
    
            const { borrower_id, group_id, amount } = debtResult.rows[0];
    
            // ✅ Mark debt as resolved
            await pool.query(
                `UPDATE debts 
                 SET status = 'resolved' 
                 WHERE debt_id = $1`,
                [debt_id]
            );
    
            // ✅ Decrease `total_owed` for the borrower
            await pool.query(
                `UPDATE user_groups 
                 SET total_owed = COALESCE((
                    SELECT SUM(amount) 
                    FROM debts 
                    WHERE borrower_id = $1 AND group_id = $2 
                    AND status = 'unresolved' AND sponsored = FALSE
                 ), 0)
                 WHERE user_id = $1 AND group_id = $2`,
                [borrower_id, group_id]
            );
    
            // ✅ Decrease `total_loaned` for the lender
            await pool.query(
                `UPDATE user_groups 
                 SET total_loaned = COALESCE((
                    SELECT SUM(amount) 
                    FROM debts 
                    WHERE lender_id = $1 AND group_id = $2 
                    AND status = 'unresolved' AND sponsored = FALSE
                 ), 0)
                 WHERE user_id = $1 AND group_id = $2`,
                [lender_id, group_id]
            );
    
            await pool.query("COMMIT"); // Commit transaction
    
            res.json({ message: "Loan resolved successfully", debt_id, lender_id, borrower_id });
        } catch (err) {
            await pool.query("ROLLBACK"); // Rollback on error
            console.error("Error resolving loan:", err);
            res.status(500).json({ message: "Server error" });
        }
    });
    
    return router;
};

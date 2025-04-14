//transactions.js
const express = require("express");
const router = express.Router();
module.exports = (pool) => {
   // Helper function to add debts
async function addDebts(transaction_id, group_id, lender_id, amount, sponsors) {
    // Get user IDs of sponsored users from usernames
    const sponsorQuery = await pool.query(
        `SELECT user_id FROM users WHERE username = ANY($1)`,
        [sponsors]
    );
    const sponsoredUserIds = sponsorQuery.rows.map(row => row.user_id);

    console.log("Debt transaction started...");
    // Get all group members except the payer
    const groupUsers = await pool.query(
        `SELECT ug.user_id FROM user_groups ug
         WHERE ug.group_id = $1 AND ug.user_id != $2`,
        [group_id, lender_id]
    );
    console.log("Fetched group users (excluding lender):", groupUsers.rows.map(u => u.user_id));

    const debtors = groupUsers.rows.map(row => ({
        user_id: row.user_id,
        sponsored: sponsoredUserIds.includes(row.user_id), // Match user ID from sponsor list
    }));
    console.log("Debtors with sponsor info:", debtors);

    // Calculate the share amount only for non-sponsored users
    const nonSponsoredUsers = debtors.filter(debtor => !debtor.sponsored);
    const shareAmount = amount / (nonSponsoredUsers.length + 1); // Split equally
    console.log("Number of debtors to insert:", debtors.length);

    // Insert debts
    const debtQueries = debtors.map(debtor => {
        return pool.query(
            `INSERT INTO debts (transaction_id, group_id, lender_id, borrower_id, amount, status, sponsored, created_at) 
             VALUES ($1, $2, $3, $4, $5, 'unresolved', $6, CURRENT_TIMESTAMP)`,
            [
                transaction_id,
                group_id,
                lender_id,
                debtor.user_id,
                debtor.sponsored ? 0 : shareAmount, // Sponsored users owe 0
                debtor.sponsored
            ]
        ).catch(err => {
            console.error(`Error inserting debt for debtor ${debtor.user_id}:`, err);
        });
    });

    await Promise.all(debtQueries);

    // Calculate the total for non-sponsored users
    const nonSponsoredTotal = amount - nonSponsoredUsers.length * shareAmount;

    // Update total_spent & total_loaned for the lender (logged-in user)
    await pool.query(
        `UPDATE user_groups 
         SET total_spent = total_spent + $1,
             total_loaned = COALESCE((
                SELECT SUM(amount) 
                FROM debts 
                WHERE lender_id = $2 AND group_id = $3 
                AND status = 'unresolved' AND sponsored = false
             ), 0)
         WHERE user_id = $2 AND group_id = $3`,
        [nonSponsoredTotal, lender_id, group_id]
    );

    // Update total_spent & total_owed for each non-sponsored borrower
    const debtUpdates = debtors
        .filter(debtor => !debtor.sponsored) // Only update non-sponsored borrowers
        .map(debtor => pool.query(
            `UPDATE user_groups 
             SET total_spent = total_spent + $1
             WHERE user_id = $2 AND group_id = $3`,
            [shareAmount, debtor.user_id, group_id]
        ).then(() => pool.query(
            `UPDATE user_groups 
             SET total_owed = COALESCE((
                SELECT SUM(amount) 
                FROM debts 
                WHERE borrower_id = $1 AND group_id = $2 
                AND status = 'unresolved' AND sponsored = false
             ), 0)
             WHERE user_id = $1 AND group_id = $2`,
            [debtor.user_id, group_id]
        )));

    await Promise.all(debtUpdates);
}

// Route to add transaction
router.post("/add", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { group_id, amount, reason, sponsors = [], tag } = req.body;
    const lender_id = req.user?.user_id;

    if (!group_id || !amount) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        await pool.query("BEGIN"); // Start transaction
        await pool.query('SET CONSTRAINTS ALL DEFERRED');

        // Insert transaction
        const transactionResult = await pool.query(
            `INSERT INTO transactions (group_id, user_id, amount, reason, tag, created_at) 
             VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) 
             RETURNING transaction_id`,
            [group_id, lender_id, amount, reason || null, tag]
        );

        const transaction_id = transactionResult.rows[0].transaction_id;

        await pool.query("COMMIT"); // Commit transaction

        // Now call the addDebts function to handle debts
        await addDebts(transaction_id, group_id, lender_id, amount, sponsors);

        res.status(201).json({ message: "Transaction and debts added successfully", transactionId: transaction_id });
    } catch (err) {
        await pool.query("ROLLBACK"); // Rollback on error
        console.error("Error adding transaction and debts:", err);
        res.status(500).json({ message: "Server error" });
    }
});


    
    
    router.get("/:group_id", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
    
        const { group_id } = req.params;
    
        try {
            const result = await pool.query(
                `SELECT t.transaction_id, u.username, t.amount, t.reason,t.tag, t.created_at
                 FROM transactions t
                 JOIN users u ON t.user_id = u.user_id
                 WHERE t.group_id = $1
                 ORDER BY t.created_at DESC;
                 `,
                [group_id]
            );
    
            // Group transactions by date
            const transactionsByDate = result.rows.reduce((acc, transaction) => {
                const date = new Date(transaction.created_at).toISOString().split("T")[0]; // Get YYYY-MM-DD
                if (!acc[date]) acc[date] = [];
                acc[date].push(transaction);
                return acc;
            }, {});
    
            res.json(transactionsByDate);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            res.status(500).json({ message: "Server error" });
        }
    });

    router.get("/:group_id/members", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
    
        const { group_id } = req.params;
    
        try {
            const result = await pool.query(
                `SELECT u.user_id, u.username 
                 FROM user_groups ug
                 JOIN users u ON ug.user_id = u.user_id
                 WHERE ug.group_id = $1 AND u.user_id != $2`,
                [group_id, req.user.user_id] // Exclude logged-in user
            );
    
            res.json(result.rows);
        } catch (error) {
            console.error("Error fetching group members:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
    
      
    

    return router;
};

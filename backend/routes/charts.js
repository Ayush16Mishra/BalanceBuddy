const express = require("express");
const router = express.Router();



module.exports = (client)=>{
// Get trips (groups) with spending for the logged-in user
router.get("/trips", async (req, res) => {
    console.log("Authenticated:", req.isAuthenticated()); // Debugging
    console.log("User:", req.user); // Debugging

    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    
    const userId = req.user?.user_id; // Logged-in user's ID

    try {
      const result=await client.query( `
        SELECT g.group_id, g.name, ug.joined_at AS created_at, ug.total_spent AS spending,ug.budget
        FROM user_groups ug
        JOIN groups g ON ug.group_id = g.group_id
        WHERE ug.user_id = $1
        ORDER BY ug.joined_at ASC;
      `,[userId]);
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching trips:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


  router.get("/spending-by-category", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const userId = req.user?.user_id;

    try {
        const result = await client.query(`
            SELECT t.tag, SUM(t.amount) AS total_spent
            FROM transactions t
            JOIN user_groups ug ON t.group_id = ug.group_id
            WHERE ug.user_id = $1 AND t.tag IS NOT NULL
            GROUP BY t.tag
            ORDER BY total_spent DESC;
        `, [userId]);

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching spending by category:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


  return router;
}

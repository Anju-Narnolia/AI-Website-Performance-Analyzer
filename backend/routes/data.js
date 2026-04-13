const express = require("express");
const website = require("../model/lighthouse");

const router = express.Router();

router.get("/data", async (req, res) => {
    try {
        const data = await website.findOne({ userId: req.userId });
        
        if (!data) {
            return res.status(404).json({ message: "No data found" });
        }
        
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving data", error: error.message });
    }
});

module.exports = router;

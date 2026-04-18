import express from "express";
import Lighthouse from "../model/lighthouse.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get user's website history with latest scores
router.get("/history", authMiddleware, async (req, res) => {
  console.log("trying to get webite from lighthouse");
  try {
    // Get all websites for this user
    const websites = await Lighthouse.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    if (!websites || websites.length === 0) {
      console.log("no website found");
      return res.json({ websites: [], message: "No websites analyzed yet" });
    }
    // // Get latest lighthouse report for each website
    const websitesWithScores = websites.map(
      ({ name, url, scores, metrics, createdAt }) => ({
        name,
        url,
        scores,
        metrics,
        createdAt,
      }),
    );
    console.log("websites with scores:", websitesWithScores);
    res.json({ websites: websitesWithScores });
  } catch (error) {
    console.error("Error fetching website history:", error);
    res
      .status(500)
      .json({ message: "Error retrieving history", error: error.message });
  }
});

// Get data (legacy endpoint)
router.get("/data", authMiddleware, async (req, res) => {
  try {
    const data = await Lighthouse.findOne({ userId: req.userId });

    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving data", error: error.message });
  }
});

export default router;

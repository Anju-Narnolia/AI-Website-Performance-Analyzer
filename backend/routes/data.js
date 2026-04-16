import express from "express";
import Lighthouse from "../model/lighthouse.js";
import Website from "../model/website.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get user's website history with latest scores
router.get("/history", authMiddleware, async (req, res) => {
  try {
    // Get all websites for this user
    const websites = await Website.find({ userId: req.userId }).sort({ createdAt: -1 });

    if (!websites || websites.length === 0) {
      return res.json({ websites: [], message: "No websites analyzed yet" });
    }

    // Get latest lighthouse report for each website
    const websitesWithScores = await Promise.all(
      websites.map(async (site) => {
        const latestReport = await Lighthouse.findOne({
          projectId: site._id,
          userId: req.userId,
        }).sort({ testedAt: -1 });

        return {
          id: site._id,
          url: site.URL,
          name: site.name,
          createdAt: site.createdAt,
          latestScore: latestReport
            ? {
                performance: latestReport.scores?.performance || 0,
                accessibility: latestReport.scores?.accessibility || 0,
                seo: latestReport.scores?.seo || 0,
                bestPractices: latestReport.scores?.bestPractices || 0,
                testedAt: latestReport.testedAt,
              }
            : null,
          reportsCount: await Lighthouse.countDocuments({
            projectId: site._id,
            userId: req.userId,
          }),
        };
      })
    );

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

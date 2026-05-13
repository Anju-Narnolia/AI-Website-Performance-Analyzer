import mongoose from "mongoose";

const websiteScoreSchema = new mongoose.Schema({
  totalScore: Number,
  performance: Number,
  seo: Number,
  accessibility: Number,
  bestPractices: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("WebsiteScore", websiteScoreSchema);

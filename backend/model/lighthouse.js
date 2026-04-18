import mongoose from "mongoose";

const lighthouseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
    },
    scores: {
      performance: Number,
      accessibility: Number,
      bestPractices: Number,
      seo: Number,
    },

    metrics: {
      fcp: String,
      lcp: String,
      cls: String,
      tbt: String,
      speedIndex: String,
    },

    issues: [
      {
        category: String,
        message: String,
        severity: {
          type: String,
          enum: ["low", "medium", "high"],
        },
      },
    ],

    aiSuggestions: [
      {
        category: {
          type: String,
          enum: ["performance", "seo", "accessibility", "bestPractices"],
        },
        issue: String,
        severity: {
          type: String,
          enum: ["low", "medium", "high"],
        },
        fix: String,
        code: String,
      },
    ],

    rawReport: {
      type: Object,
      select: false, // 🔥 optimized
    },

    testedAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Indexes
lighthouseSchema.index({ projectId: 1, testedAt: 1 });
lighthouseSchema.index({ userId: 1, url: 1 });

export default mongoose.model("Lighthouse", lighthouseSchema);
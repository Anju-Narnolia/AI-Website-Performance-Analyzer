const mongoose = require("mongoose");

const lighthouseSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    testedAt: {
      type: Date,
      required: true,
      index: true, // important for graphs
    },

    scores: {
      performance: { type: Number, required: true },
      accessibility: { type: Number, required: true },
      bestPractices: { type: Number, required: true },
      seo: { type: Number, required: true },
    },

    metrics: {
      fcp: Number,
      lcp: Number,
      cls: Number,
      tbt: Number,
      speedIndex: Number,
    },

    environment: {
      device: {
        type: String,
        enum: ["mobile", "desktop"],
        default: "mobile",
      },
      location: {
        type: String,
        default: "India",
      },
    },

    rawReport: {
      type: Object, // or Schema.Types.Mixed
    },
  },
  { timestamps: true },
);

// 🔥 Index for fast dashboard queries
lighthouseSchema.index({ projectId: 1, testedAt: 1 });

module.exports = mongoose.model("Lighthouse", lighthouseSchema);

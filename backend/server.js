import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import dataRoutes from "./routes/data.js";
import authMiddleware from "./middleware/auth.js";
import promBundle from "express-prom-bundle";

dotenv.config();

const app = express();

//PROMETHEUS SETUP
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  promClient: {
    collectDefaultMetrics: {},
  },
});

app.use(metricsMiddleware); // 👈 MUST be before routes

//MIDDLEWARES
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// DATABASE CONNECTION
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};

connectDB();

// ROUTES
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running");
});

app.get("/api/test-auth", authMiddleware, (req, res) => {
  res.json({ message: "Auth works!", userId: req.userId });
});

app.use("/api/user", userRoutes);
app.use("/api/analyze", urlRoutes);
app.use("/api/dashboard", dataRoutes);

// SERVER START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
  console.log(`📊 Metrics available at: /metrics`);
});

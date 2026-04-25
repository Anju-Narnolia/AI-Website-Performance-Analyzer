import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import dataRoutes from "./routes/data.js";
import authMiddleware from "./middleware/auth.js";
import client from "prom-client";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

const connectdb = async () => {
  try {
    await moongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};
connectdb();
const register = new client.Registry(); // Create a Registry for Prometheus metrics
client.collectDefaultMetrics({ register }); // Collect default metrics (CPU, memory, etc.)
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

register.registerMetric(httpRequestCounter);

// Middleware to track requests
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });
  });
  next();
});
// 🔥 IMPORTANT: metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
  res.send("metrics endpoint: " + register.metrics());
});

app.get("/", (req, res) => {
  res.send("backend server is running");
});

app.get("/api/test-auth", authMiddleware, (req, res) => {
  res.json({ message: "Auth works!", userId: req.userId });
});

app.use("/api/user", userRoutes);
app.use("/api/analyze", urlRoutes);
app.use("/api/dashboard", dataRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import dataRoutes from "./routes/data.js";
import authMiddleware from "./middleware/auth.js";

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

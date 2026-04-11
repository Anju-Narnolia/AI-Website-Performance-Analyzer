const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const moongoose = require("mongoose");
const app = express();

dotenv.config();

// Enhanced CORS configuration to allow Authorization header
app.use(cors({
  origin: "*", // Allow all origins for development
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const authMiddleware = require("./middleware/auth.js");

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

app.use("/api/user", require("./routes/userRoutes.js"));
app.use("/api/analyze", authMiddleware, require("./routes/urlRoutes.js"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

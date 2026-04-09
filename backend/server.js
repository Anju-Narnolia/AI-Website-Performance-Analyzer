const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const moongoose = require("mongoose");
const app = express();

dotenv.config();
app.use(cors());
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

app.use("/api/user", require("./routes/userRoutes.js"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

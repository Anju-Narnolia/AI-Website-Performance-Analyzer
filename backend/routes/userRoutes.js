const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../model/user");
// const authMiddleware = require("../middleware/auth");

const JWT_SECRET =
  process.env.JWT_SECRET || "your_secret_key_change_in_production_for_security";

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password, companyName } = req.body;
  if (!name || !email || !password || !companyName) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      companyName,
    });
    await user.save();
    console.log("User registered successfully:", user);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ message: "Server error", error: error.messag });
  }
});
module.exports = router;

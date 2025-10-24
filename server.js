import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/User.js";

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect("mongodb://127.0.0.1:27017/userDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// POST API for Registration
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User Registered Successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    res.status(200).json({ message: "Login Successful", user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(5000, () => {
  console.log("🚀 Server is running on port 5000");
});

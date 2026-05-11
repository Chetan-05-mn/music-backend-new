import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import songRoutes from "./routes/songRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.get("/", (req, res) => {
  res.send("Music backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
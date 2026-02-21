import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import subscriptionsRouter from "./routes/subscriptions";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    "https://sub-minder.vercel.app",
    "https://sub-minder-pr9gw6ct4-marcs-projects-4f93897f.vercel.app",
    "http://localhost:8081",
    "http://localhost:8080",
  ],
  credentials: true,
}));
app.use(express.json());

app.use("/api/subscriptions", subscriptionsRouter);

async function start() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not defined in env");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

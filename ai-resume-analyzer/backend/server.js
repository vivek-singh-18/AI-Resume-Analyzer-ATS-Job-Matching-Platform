import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import documentsRoutes from "./routes/documents.js";
import http from "http";
import { Server as IOServer } from "socket.io";
import { initSocket } from "./utils/socket.js";
import mongoose from "mongoose";
import { resumePendingJobs } from "./jobs/worker.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// MongoDB connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentsRoutes);

// Health check
app.get("/", (req, res) => res.json({ ok: true, now: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

// Socket.io
const io = new IOServer(server, { cors: { origin: "*" } });
initSocket(io);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await resumePendingJobs();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { app, server, io };

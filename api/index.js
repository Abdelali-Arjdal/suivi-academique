const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("../backend/config/db");
const studentRoutes = require("../backend/routes/student.routes");
const subjectRoutes = require("../backend/routes/subject.routes");
const gradeRoutes = require("../backend/routes/grade.routes");
const statsRoutes = require("./stats.routes");

const app = express();

// Initialize database connection
let dbConnected = false;
const initDB = async () => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (error) {
            console.error("Database connection error:", error);
            dbConnected = false;
        }
    }
};

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB before handling requests
app.use(async (req, res, next) => {
    await initDB();
    next();
});

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/stats", statsRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", dbConnected });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Internal server error" });
});

// Export for Vercel serverless
module.exports = app;

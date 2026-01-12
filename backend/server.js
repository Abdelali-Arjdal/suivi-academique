const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/students", require("./routes/student.routes"));
app.use("/api/subjects", require("./routes/subject.routes"));
app.use("/api/grades", require("./routes/grade.routes"));
app.use("/api/stats", require("../api/stats.routes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur lancé sur le port ${PORT}`)
);

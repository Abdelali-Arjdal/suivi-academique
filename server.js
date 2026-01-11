const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/students", require("./routes/student.routes"));
app.use("/api/subjects", require("./routes/subject.routes"));
app.use("/api/grades", require("./routes/grade.routes"));

app.listen(process.env.PORT, () =>
  console.log(`Serveur lancé sur le port ${process.env.PORT}`)
);

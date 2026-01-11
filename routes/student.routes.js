const express = require("express");
const Student = require("../models/Student");
const router = express.Router();

router.post("/", async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
});

router.get("/", async (req, res) => {
  res.json(await Student.find());
});

module.exports = router;

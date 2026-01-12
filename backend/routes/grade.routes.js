const express = require("express");
const router = express.Router();
const Grade = require("../models/Grade");

router.get("/", async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate("studentId")
      .populate("subjectId");

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const grade = await Grade.create(req.body);
    await grade.populate("studentId");
    await grade.populate("subjectId");
    res.json(grade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate("studentId")
      .populate("subjectId");
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/student/:studentId", async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.params.studentId })
      .populate("studentId")
      .populate("subjectId");
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

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

module.exports = router;

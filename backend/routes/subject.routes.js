const express = require("express");
const Subject = require("../models/Subject");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
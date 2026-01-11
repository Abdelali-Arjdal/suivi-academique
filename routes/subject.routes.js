const express = require("express");
const Subject = require("../models/Subject");
const router = express.Router();

router.post("/", async (req, res) => {
  res.json(await Subject.create(req.body));
});

router.get("/", async (req, res) => {
  res.json(await Subject.find());
});

module.exports = router;
    
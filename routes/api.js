const express = require("express");
const Upgrades = require("../models/Upgrades");

const router = express.Router();

router.get("/upgrades", (req, res) => {
  res.json(Upgrades);
});

module.exports = router;

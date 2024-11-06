const express = require("express");
const Upgrades = require("../models/Upgrades");

const router = express.Router();

router.get("/", async (req, res) => {
  const upgrades = await Upgrades.find({});
  res.render("clickergame", { title: "Clicker Game", upgrades });
});

module.exports = router;

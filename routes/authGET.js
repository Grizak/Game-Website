const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup" });
});

router.get("/signin", (req, res) => {
  res.render("signin", { title: "Signin" });
});

module.exports = router;

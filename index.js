const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const Game = require("./models/Game");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(ejsLayouts);
app.set("layout", "layouts/layout");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.post("/games", async (req, res) => {
  try {
    const games = await Game.find({});
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching games" });
  }
});

let games = [];

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/games", async (req, res) => {
  games = await Game.find({});
  res.render("games", { title: "Games", games });
});

app.get("/guessgame", (req, res) => {
  res.render("guessgame", { title: "Guess Game" });
});

app.use("/clickergame", require("./routes/clickergameroutes"));
app.use("/api/auth", require("./routes/auth"));
app.use("/auth", require("./routes/authGET"));
app.use("/api", require("./routes/api"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

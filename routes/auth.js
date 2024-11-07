const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // or use another email provider
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Email already exists" }] });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create a new user with isVerified set to false
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });
    await user.save();

    // Create verification URL
    const verificationUrl = `/api/auth/verify-email?token=${verificationToken}`;

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Please verify your email",
      text: `Click this link to verify your email: ${verificationUrl}`,
      html: `<p>Click this link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    });

    // Return a success response
    res.status(201).render("successignup", {
      title: "Signup Successful",
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    // Find the user with the matching verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).render("error", {
        title: "Verification Failed",
        message: "Invalid or expired token",
      });
    }

    // Verify the user's account and clear the token
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Redirect to a "verified" page or login page after verification
    res.redirect("/auth/signin"); // Adjust this route as needed
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Server Error",
      message: "Internal server error",
    });
  }
});

router.get("/check-verification", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's verification status
    res.json({ isVerified: user.isVerified });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid email" }] });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ errors: [{ msg: "Invalid password" }] });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    const isVerified = user.isVerified;

    if (!isVerified) {
      res.status();
    }

    res.status(200).render("index", { title: "Home", token });
  } catch (err) {
    console.error("An unexprecteed error occured: ", err);
  }
});

module.exports = router;

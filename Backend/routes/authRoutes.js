const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  registerAdmin,
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
  changePassword,
} = require("../controllers/authController");

const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public — rate limited to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Try again later." },
});

router.post("/register", registerAdmin);

router.post("/login", loginLimiter, loginAdmin);

router.get("/me", isAuthenticated, getCurrentAdmin);

router.post("/logout", isAuthenticated, logoutAdmin);

router.put("/change-password", isAuthenticated, changePassword);

module.exports = router;

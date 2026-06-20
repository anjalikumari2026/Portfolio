const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  createContact,
  getAllContacts,
  getUnreadCount,
  markAsRead,
  deleteContact,
} = require("../controllers/contactController");

const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public — rate limited to prevent spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many messages. Try again later." },
});

router.post("/", contactLimiter, createContact);

// Private
router.get("/unread-count", isAuthenticated, getUnreadCount);
router.get("/", isAuthenticated, getAllContacts);
router.patch("/:id/read", isAuthenticated, markAsRead);
router.delete("/:id", isAuthenticated, deleteContact);

module.exports = router;

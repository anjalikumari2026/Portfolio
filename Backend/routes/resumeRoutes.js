const express = require("express");

const {
  uploadResume,
  getResume,
  deleteResume,
} = require("../controllers/resumeController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const uploadResumeMiddleware = require("../middleware/uploadResumeMiddleware");

const router = express.Router();

// Public
router.get("/", getResume);

// Private
router.put("/", isAuthenticated, uploadResumeMiddleware.single("resume"), uploadResume);
router.delete("/", isAuthenticated, deleteResume);

module.exports = router;

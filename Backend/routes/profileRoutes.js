const express = require("express");

const {
  createProfile,
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
} = require("../controllers/profileController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getProfile);

// Private
router.post("/", isAuthenticated, createProfile);
router.put("/", isAuthenticated, updateProfile);
router.put("/image", isAuthenticated, upload.single("profileImage"), uploadProfileImage);
router.delete("/image", isAuthenticated, deleteProfileImage);

module.exports = router;

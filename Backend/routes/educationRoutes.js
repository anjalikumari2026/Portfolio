const express = require("express");
const {
  createEducation,
  getAllEducation,
  getEducationById,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getAllEducation);
router.get("/:id", getEducationById);

// Private
router.post("/", isAuthenticated, createEducation);
router.put("/:id", isAuthenticated, updateEducation);
router.delete("/:id", isAuthenticated, deleteEducation);

module.exports = router;

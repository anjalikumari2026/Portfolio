const express = require("express");

const {
  createSkill,
  getAllSkills,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getAllSkills);

// Private
router.post("/", isAuthenticated, createSkill);
router.put("/:id", isAuthenticated, updateSkill);
router.delete("/:id", isAuthenticated, deleteSkill);

module.exports = router;

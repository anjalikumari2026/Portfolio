const express = require("express");

const {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const uploadExperience = require("../middleware/uploadExperienceMiddleware");

const router = express.Router();

// Public
router.get("/", getAllExperiences);
router.get("/:id", getExperienceById);

// Private
router.post("/", isAuthenticated, uploadExperience.fields([
  { name: "companyImage", maxCount: 1 },
  { name: "certificateFile", maxCount: 1 },
]), createExperience);

router.put("/:id", isAuthenticated, uploadExperience.fields([
  { name: "companyImage", maxCount: 1 },
  { name: "certificateFile", maxCount: 1 },
]), updateExperience);

router.delete("/:id", isAuthenticated, deleteExperience);

module.exports = router;

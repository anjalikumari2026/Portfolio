const express = require("express");

const {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public Routes
router.get("/", getAllProjects);
router.get("/:id", getSingleProject);

// Private Routes
router.post("/", isAuthenticated, upload.single("image"), createProject);
router.put("/:id", isAuthenticated, upload.single("image"), updateProject);
router.delete("/:id", isAuthenticated, deleteProject);

module.exports = router;

const express = require("express");

const {
  createCertificate,
  getAllCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
} = require("../controllers/certificateController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const uploadCertificate = require("../middleware/uploadCertificateMiddleware");

const router = express.Router();

// Public
router.get("/", getAllCertificates);
router.get("/:id", getCertificateById);

// Private
router.post("/", isAuthenticated, uploadCertificate.single("certificateFile"), createCertificate);
router.put("/:id", isAuthenticated, uploadCertificate.single("certificateFile"), updateCertificate);
router.delete("/:id", isAuthenticated, deleteCertificate);

module.exports = router;

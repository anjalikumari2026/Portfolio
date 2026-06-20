const multer = require("multer");

const ALLOWED_TYPES = [
  "image/png", "image/jpg", "image/jpeg", "image/webp",
  "application/pdf",
];
const MAX_SIZE = 10 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Invalid file type. Allowed: PNG, JPG, JPEG, WEBP, PDF");
    error.statusCode = 400;
    cb(error, false);
  }
};

const uploadExperience = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

module.exports = uploadExperience;

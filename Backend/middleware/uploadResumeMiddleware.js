const multer = require("multer");

const ALLOWED_TYPES = ["application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Invalid file type. Only PDF files are allowed.");
    error.statusCode = 400;
    cb(error, false);
  }
};

const uploadResume = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

module.exports = uploadResume;

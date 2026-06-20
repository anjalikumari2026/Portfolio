const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    resumeUrl: {
      type: String,
      required: true,
    },
    resumePublicId: {
      type: String,
    },
    fileName: {
      type: String,
      default: "My Resume",
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);

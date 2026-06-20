const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, "Issuer is required"],
      trim: true,
    },
    issueDate: {
      type: Date,
    },
    credentialId: {
      type: String,
      trim: true,
    },
    verifyLink: {
      type: String,
      trim: true,
    },
    certificateFile: {
      type: String,
    },
    certificatePublicId: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);

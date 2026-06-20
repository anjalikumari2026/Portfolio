const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
    },
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
    skillsUsed: [{
      type: String,
    }],
    location: {
      type: String,
      trim: true,
    },
    companyImage: {
      type: String,
    },
    companyImagePublicId: {
      type: String,
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

module.exports = mongoose.model("Experience", experienceSchema);

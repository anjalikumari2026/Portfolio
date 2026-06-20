const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
    },

    institution: {
      type: String,
      required: [true, "Institution is required"],
      trim: true,
    },

    university: {
      type: String,
      trim: true,
    },

    startYear: {
      type: String,
      required: [true, "Start year is required"],
      trim: true,
    },

    endYear: {
      type: String,
      trim: true,
    },

    cgpaOrPercentage: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Education", educationSchema);

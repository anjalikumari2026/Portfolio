const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    technologies: [{
      type: String,
    }],
    githubLink: {
      type: String,
    },
    liveLink: {
      type: String,
    },
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: "Full Stack",
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "archived", "draft"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);

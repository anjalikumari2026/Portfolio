const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
    },

    github: {
      type: String,
    },

    linkedin: {
      type: String,
    },

    instagram: {
      type: String,
    },

    twitter: {
      type: String,
    },

    profileImage: {
      type: String,
    },

    profilePublicId: {
      type: String,
    },

    email: {
      type: String,
    },

    phone: {
      type: String,
    },

    location: {
      type: String,
    },

    website: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Profile", profileSchema);

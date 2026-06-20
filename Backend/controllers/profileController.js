const Profile = require("../models/ProfileModel");
const cloudinary = require("cloudinary").v2;

exports.createProfile = async (req, res, next) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const profile = await Profile.findOne();
    const oldPublicId = profile?.profilePublicId;

    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.FOLDER_NAME || "Portfolio",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      {
        profileImage: result.secure_url,
        profilePublicId: result.public_id,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProfileImage = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    const publicId = profile?.profilePublicId;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "No profile image to delete",
      });
    }

    await cloudinary.uploader.destroy(publicId);

    await Profile.findOneAndUpdate(
      {},
      {
        profileImage: "",
        profilePublicId: "",
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile image deleted successfully",
      profile: await Profile.findOne(),
    });
  } catch (error) {
    next(error);
  }
};

const Resume = require("../models/ResumeModel");
const cloudinary = require("cloudinary").v2;

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const existing = await Resume.findOne();

    if (existing && existing.resumePublicId) {
      await cloudinary.uploader.destroy(existing.resumePublicId, {
        resource_type: "raw",
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "portfolio/resumes",
        resource_type: "raw",
      }
    );

    if (existing) {
      await Resume.deleteOne({ _id: existing._id });
    }

    const resume = await Resume.create({
      resumeUrl: result.secure_url,
      resumePublicId: result.public_id,
      fileName: req.file.originalname || "My Resume",
      uploadedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: existing
        ? "Resume replaced successfully"
        : "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    next(error);
  }
};

exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      resume: resume || null,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne();

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found to delete",
      });
    }

    if (resume.resumePublicId) {
      await cloudinary.uploader.destroy(resume.resumePublicId, {
        resource_type: "raw",
      });
    }

    await Resume.deleteOne({ _id: resume._id });

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

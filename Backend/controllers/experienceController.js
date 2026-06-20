const Experience = require("../models/ExperienceModel");
const cloudinary = require("cloudinary").v2;

const ALLOWED_FIELDS = [
  "companyName", "role", "startDate", "endDate",
  "currentlyWorking", "description", "skillsUsed", "location", "order",
];

const uploadToCloudinary = (buffer, mimetype, folder) => {
  return cloudinary.uploader.upload(
    `data:${mimetype};base64,${buffer.toString("base64")}`,
    { folder, resource_type: mimetype === "application/pdf" ? "raw" : "image" }
  );
};

const parseSkills = (val) => {
  try { return JSON.parse(val); }
  catch { return val.split(",").map((s) => s.trim()).filter(Boolean); }
};

exports.createExperience = async (req, res, next) => {
  try {
    const data = {};
    ALLOWED_FIELDS.forEach((f) => {
      if (req.body[f] !== undefined) {
        if (f === "skillsUsed") data[f] = parseSkills(req.body[f]);
        else if (f === "currentlyWorking") data[f] = req.body[f] === "true" || req.body[f] === true;
        else if (f === "order") data[f] = Number(req.body[f]) || 0;
        else data[f] = req.body[f];
      }
    });

    if (req.files?.companyImage) {
      const result = await uploadToCloudinary(
        req.files.companyImage[0].buffer,
        req.files.companyImage[0].mimetype,
        "portfolio/experiences"
      );
      data.companyImage = result.secure_url;
      data.companyImagePublicId = result.public_id;
    }

    if (req.files?.certificateFile) {
      const result = await uploadToCloudinary(
        req.files.certificateFile[0].buffer,
        req.files.certificateFile[0].mimetype,
        "portfolio/experience-certificates"
      );
      data.certificateFile = result.secure_url;
      data.certificatePublicId = result.public_id;
    }

    const experience = await Experience.create(data);
    res.status(201).json({ success: true, experience });
  } catch (error) {
    next(error);
  }
};

exports.getAllExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
    res.status(200).json({ success: true, experiences });
  } catch (error) {
    next(error);
  }
};

exports.getExperienceById = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }
    res.status(200).json({ success: true, experience });
  } catch (error) {
    next(error);
  }
};

exports.updateExperience = async (req, res, next) => {
  try {
    const existing = await Experience.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    const data = {};
    ALLOWED_FIELDS.forEach((f) => {
      if (req.body[f] !== undefined) {
        if (f === "skillsUsed") data[f] = parseSkills(req.body[f]);
        else if (f === "currentlyWorking") data[f] = req.body[f] === "true" || req.body[f] === true;
        else if (f === "order") data[f] = Number(req.body[f]) || 0;
        else data[f] = req.body[f];
      }
    });

    if (req.files?.companyImage) {
      if (existing.companyImagePublicId) {
        await cloudinary.uploader.destroy(existing.companyImagePublicId).catch(() => {});
      }
      const result = await uploadToCloudinary(
        req.files.companyImage[0].buffer,
        req.files.companyImage[0].mimetype,
        "portfolio/experiences"
      );
      data.companyImage = result.secure_url;
      data.companyImagePublicId = result.public_id;
    }

    if (req.files?.certificateFile) {
      if (existing.certificatePublicId) {
        const resType = existing.certificateFile?.includes(".pdf") ? "raw" : "image";
        await cloudinary.uploader.destroy(existing.certificatePublicId, { resource_type: resType }).catch(() => {});
      }
      const result = await uploadToCloudinary(
        req.files.certificateFile[0].buffer,
        req.files.certificateFile[0].mimetype,
        "portfolio/experience-certificates"
      );
      data.certificateFile = result.secure_url;
      data.certificatePublicId = result.public_id;
    }

    const experience = await Experience.findByIdAndUpdate(req.params.id, data, {
      new: true, runValidators: true,
    });
    res.status(200).json({ success: true, message: "Experience updated successfully", experience });
  } catch (error) {
    next(error);
  }
};

exports.deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    if (experience.companyImagePublicId) {
      await cloudinary.uploader.destroy(experience.companyImagePublicId).catch(() => {});
    }
    if (experience.certificatePublicId) {
      const resType = experience.certificateFile?.includes(".pdf") ? "raw" : "image";
      await cloudinary.uploader.destroy(experience.certificatePublicId, { resource_type: resType }).catch(() => {});
    }

    await Experience.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Experience deleted successfully" });
  } catch (error) {
    next(error);
  }
};

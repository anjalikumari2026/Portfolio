const Education = require("../models/EducationModel");

const ALLOWED_FIELDS = [
  "degree", "institution", "university", "startYear",
  "endYear", "cgpaOrPercentage", "description", "location", "order",
];

const pick = (body) =>
  Object.fromEntries(
    Object.entries(body).filter(([k]) => ALLOWED_FIELDS.includes(k))
  );

exports.createEducation = async (req, res, next) => {
  try {
    const education = await Education.create(pick(req.body));
    res.status(201).json({ success: true, education });
  } catch (error) {
    next(error);
  }
};

exports.getAllEducation = async (req, res, next) => {
  try {
    const education = await Education.find().sort({ order: 1, startYear: -1 });
    res.status(200).json({ success: true, education });
  } catch (error) {
    next(error);
  }
};

exports.getEducationById = async (req, res, next) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education) {
      return res.status(404).json({ success: false, message: "Education not found" });
    }
    res.status(200).json({ success: true, education });
  } catch (error) {
    next(error);
  }
};

exports.updateEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true,
      runValidators: true,
    });
    if (!education) {
      return res.status(404).json({ success: false, message: "Education not found" });
    }
    res.status(200).json({ success: true, education });
  } catch (error) {
    next(error);
  }
};

exports.deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) {
      return res.status(404).json({ success: false, message: "Education not found" });
    }
    res.status(200).json({ success: true, message: "Education deleted successfully" });
  } catch (error) {
    next(error);
  }
};

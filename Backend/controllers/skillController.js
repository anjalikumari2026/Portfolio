const Skill = require("../models/SkillModel");

const ALLOWED_FIELDS = ["name", "level", "category", "icon", "order"];

exports.createSkill = async (req, res, next) => {
  try {
    const data = {};
    ALLOWED_FIELDS.forEach((f) => {
      if (req.body[f] !== undefined) {
        if (f === "level" || f === "order") data[f] = Number(req.body[f]) || 0;
        else data[f] = req.body[f];
      }
    });

    const skill = await Skill.create(data);
    res.status(201).json({ success: true, skill });
  } catch (error) {
    next(error);
  }
};

exports.getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1, name: 1 });
    res.status(200).json({ success: true, skills });
  } catch (error) {
    next(error);
  }
};

exports.updateSkill = async (req, res, next) => {
  try {
    const existing = await Skill.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    const data = {};
    ALLOWED_FIELDS.forEach((f) => {
      if (req.body[f] !== undefined) {
        if (f === "level" || f === "order") data[f] = Number(req.body[f]) || 0;
        else data[f] = req.body[f];
      }
    });

    const skill = await Skill.findByIdAndUpdate(req.params.id, data, {
      new: true, runValidators: true,
    });
    res.status(200).json({ success: true, message: "Skill updated successfully", skill });
  } catch (error) {
    next(error);
  }
};

exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }
    await Skill.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    next(error);
  }
};
